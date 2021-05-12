import hashlib
import json
import logging
import multiprocessing
import time
import uuid
import random
from collections import OrderedDict
from datetime import datetime
from logging.config import dictConfig
from bson.code import Code

from configs import file_path, file_name, default_offset, default_limit, mongo_server_host, mongo_ulca_db
from configs import mongo_ulca_dataset_col, no_of_process

import pymongo
log = logging.getLogger('file')


mongo_instance = None

class ModelThree:
    def __init__(self):
        pass

    def load_dataset(self, request):
        log.info("Loading M3 Dataset..... | {}".format(datetime.now()))
        try:
            if 'path' not in request.keys():
                path = f'{file_path}' + f'{file_name}'
            else:
                path = request["path"]
            log.info("File -- {} | {}".format(path, datetime.now()))
            dataset = open(path, "r")
            data_json = json.load(dataset)
            total, d_count, u_count, i_count, batch = len(data_json), 0, 0, 0, 100000
            update_batch, update_records, insert_batch, insert_records = [], [], [], []
            log.info(f'Enriching the dataset..... | {datetime.now()}')
            for data in data_json:
                if 'sourceText' not in data.keys() or 'targetText' not in data.keys():
                    continue
                src_hash = str(hashlib.sha256(data["sourceText"].encode('utf-16')).hexdigest())
                tgt_hash = str(hashlib.sha256(data["targetText"].encode('utf-16')).hexdigest())
                record = self.get_dataset_internal({"tags": [src_hash, tgt_hash]})
                if record:
                    log.info(f'Duplicate: {data}| {datetime.now()}')
                    d_count += 1
                    continue
                record = self.get_dataset_internal({"tags": [src_hash]})
                target = {
                    "id": uuid.uuid4(),
                    "targetText": data["targetText"],
                    "alignmentScore": random.uniform(0, 1),
                    "targetLanguage": request["details"]["targetLanguage"],
                    "sourceRef": src_hash,
                    "submitter": request["submitter"],
                    "contributors": request["contributors"],
                }
                if 'translator' in data.keys():
                    target["translator"] = data["translator"]
                if record:
                    record[0]["targets"].append(target)
                    tags_dict = {
                        "tgtHash": tgt_hash, "lang": request["details"]["targetLanguage"],
                        "collectionMode": request["details"]["collectionMode"],
                        "domain": request["details"]["domain"], "licence": request["details"]["licence"]
                    }
                    record[0]["tags"].extend(list(self.get_tags(tags_dict)))
                    update_batch.append(record[0])
                    if len(update_batch) == batch:
                        log.info(f'Adding batch of {len(update_batch)} to the BULK UPDATE list... | {datetime.now()}')
                        update_records.append(update_batch)
                        update_batch = []
                    u_count += 1
                else:
                    targets = [target]
                    tags_dict = {
                        "srcHash": src_hash, "tgtHash": tgt_hash, "tgtLang": request["details"]["targetLanguage"],
                        "collectionMode": request["details"]["collectionMode"], "srcLang": request["details"]["sourceLanguage"],
                        "domain": request["details"]["domain"], "licence": request["details"]["licence"]
                    }
                    tags = list(self.get_tags(tags_dict))
                    record = {
                        "id": uuid.uuid4(), "sourceTextHash": src_hash, "sourceText": data["sourceText"],
                        "sourceLanguage": request["details"]["sourceLanguage"],
                        "submitter": request["submitter"], "contributors": request["contributors"],
                        "targets": targets, "tags": tags
                    }
                    insert_batch.append(record)
                    if len(insert_batch) == batch:
                        log.info(f'Adding batch of {len(update_batch)} to the BULK INSERT list... | {datetime.now()}')
                        insert_records.append(insert_batch)
                        insert_batch = []
                    i_count += 1
            if insert_batch:
                insert_records.append(insert_batch)
            if update_batch:
                update_records.append(update_batch)
            pool, ins_count, upd_count = multiprocessing.Pool(no_of_process), 0, 0
            log.info(f'Dumping records.... | {datetime.now()}')
            processors = pool.map_async(self.insert, insert_records).get()
            for result in processors:
                ins_count += result
            pool.close()
            processors = pool.map_async(self.update, update_records).get()
            for result in processors:
                upd_count += result
            pool.close()
            if (ins_count + upd_count) == total:
                log.info(f'Dumping COMPLETE! total: {total} | {datetime.now()}')
            log.info(f'Done! -- UPDATES: {u_count}, INSERTS: {i_count}, "DUPLICATES": {d_count} | {datetime.now()}')
        except Exception as e:
            log.exception(e)
            return {"message": "EXCEPTION while loading dataset!!", "status": "FAILED"}
        return {"message": f'loaded {total} no. of records to DB', "status": "SUCCESS"}

    def get_tags(self, d):
        for v in d.values():
            if isinstance(v, dict):
                yield from self.get_tags(v)
            elif isinstance(v, list):
                for entries in v:
                    yield entries
            else:
                yield v

    def get_dataset_internal(self, query):
        try:
            db_query = {}
            if "tags" in query.keys():
                db_query["tags"] = {"$all": query["tags"]}
            exclude = {"_id": False}
            data = self.search(db_query, exclude, None, None)
            if data:
                return data
            else:
                return None
        except Exception as e:
            log.exception(e)
            return None

    def get_dataset(self, query):
        log.info(f'Fetching datasets..... | {datetime.now()}')
        try:
            offset = query["offset"] if 'offset' in query.keys() else default_offset
            limit = query["limit"] if 'limit' in query.keys() else default_limit
            db_query = {}
            tags, lang_tags = [], []
            if 'srcLang' in query.keys():
                tags.append(query["srcLang"])
            if 'tgtLang' in query.keys():
                for tgt in query["tgtLang"]:
                    tags.append(tgt)
            if 'collectionMode' in query.keys():
                tags.append(query["collectionMode"])
            if 'licence' in query.keys():
                tags.append(query["licence"])
            if 'domain' in query.keys():
                tags.append(query["domain"])
            if 'srcText' in query.keys():
                db_query["sourceTextHash"] = str(hashlib.sha256(query["srcText"].encode('utf-16')).hexdigest())
            if tags:
                db_query["tags"] = {"$all": tags}
            exclude = {"_id": False}
            data = self.search(db_query, exclude, offset, limit)
            count = len(data)
            if count > 30:
                data = data[:30]
            log.info(f'Result count: {count} | {datetime.now()}')
            log.info(f'Done! | {datetime.now()}')
            return {"count": count, "query": db_query, "dataset": data}
        except Exception as e:
            log.exception(e)
            return {"message": str(e), "status": "FAILED", "dataset": "NA"}

    ####################### DB ##############################

    def set_mongo_cluster(self, create):
        if create:
            log.info(f'Setting the Mongo Shard Cluster up..... | {datetime.now()}')
            client = pymongo.MongoClient(mongo_server_host)
            client.drop_database(mongo_ulca_db)
            ulca_db = client[mongo_ulca_db]
            ulca_col = ulca_db[mongo_ulca_dataset_col]
            ulca_col.create_index([("data.score", -1)])
            ulca_col.create_index([("tags", -1)])
            db = client.admin
            db.command('enableSharding', mongo_ulca_db)
            key = OrderedDict([("_id", "hashed")])
            db.command({'shardCollection': f'{mongo_ulca_db}.{mongo_ulca_dataset_col}', 'key': key})
            log.info(f'Done! | {datetime.now()}')
        else:
            return None

    def instantiate(self):
        client = pymongo.MongoClient(mongo_server_host)
        db = client[mongo_ulca_db]
        mongo_instance = db[mongo_ulca_dataset_col]
        return mongo_instance

    def get_mongo_instance(self):
        if not mongo_instance:
            return self.instantiate()
        else:
            return mongo_instance

    def insert(self, data):
        col = self.get_mongo_instance()
        col.insert_many(data)
        return len(data)

    def update(self, data):
        col = self.get_mongo_instance()
        bulk = col.initialize_unordered_bulk_op()
        for record in data:
            bulk.find({'id': record["id"]}).update({'$set': {'targets': record["targets"], "tags": record["tags"]}})
        bulk.execute()
        return len(data)
        #col.replace_one({"id": data["id"]}, data)

    # Searches the object into mongo collection
    def search(self, query, exclude, offset, res_limit):
        col = self.get_mongo_instance()
        if offset is None and res_limit is None:
            res = col.find(query, exclude).sort([('_id', 1)])
        else:
            res = col.find(query, exclude).sort([('_id', -1)]).skip(offset).limit(res_limit)
        result = []
        for record in res:
            result.append(record)
        return result


# Log config
dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '[%(asctime)s] {%(filename)s:%(lineno)d} %(threadName)s %(levelname)s in %(module)s: %(message)s',
    }},
    'handlers': {
        'info': {
            'class': 'logging.FileHandler',
            'level': 'DEBUG',
            'formatter': 'default',
            'filename': 'info.log'
        },
        'console': {
            'class': 'logging.StreamHandler',
            'level': 'DEBUG',
            'formatter': 'default',
            'stream': 'ext://sys.stdout',
        }
    },
    'loggers': {
        'file': {
            'level': 'DEBUG',
            'handlers': ['info', 'console'],
            'propagate': ''
        }
    },
    'root': {
        'level': 'DEBUG',
        'handlers': ['info', 'console']
    }
})
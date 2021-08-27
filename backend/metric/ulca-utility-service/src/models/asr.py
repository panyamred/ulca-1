from config import data_db_schema,data_asr
from repositories import DataRepo
from utilities import LANG_CODES
import logging
from logging.config import dictConfig
log = logging.getLogger('file')
repo = DataRepo()

class AsrModel:
    def __init__(self):
        self.db     =   data_db_schema
        self.col    =   data_asr

    def compute_asr_data_filters(self,asr_data):
        log.info("Updating asr filter params!")
        try:
            collection_query    =   [{ '$unwind':'$collectionMethod' },{ '$unwind':'$collectionMethod.collectionDescription' },{ '$group': { '_id': '$collectionMethod.collectionDescription', 'details': {'$addToSet': '$collectionMethod.collectionDetails'}}}]
            collectionres       =   repo.aggregate(collection_query,self.db,self.col)
            
            for filter in asr_data["filters"]:
                if filter["filter"]         ==  "sourceLanguage":
                    langres                 =   repo.distinct("sourceLanguage",self.db,self.col)
                    filter["values"]        =   self.get_language_filter(langres)
                if filter["filter"]         ==  "collectionMethod":
                    filter["values"]        =   self.get_collection_details(collectionres)
                if filter["filter"]         ==  "domain":
                    domainres               =   repo.distinct("domain",self.db,self.col)
                    filter["values"]        =   self.get_formated_data(domainres)
                if filter["filter"]         ==  "collectionSource":
                    sourceres               =   repo.distinct("collectionSource",self.db,self.col)
                    filter["values"]        =   self.get_formated_data(sourceres)
                if filter["filter"]         ==  "license":
                    licenseres              =   repo.distinct("license",self.db,self.col)
                    filter["values"]        =   self.get_formated_data(licenseres)
                if filter["filter"]         ==  "submitterName":
                    domainres               =   repo.distinct("submitter.name",self.db,self.col)
                    filter["values"]        =   self.get_formated_data(domainres)
                if filter["filter"]         ==  "format":
                    formatres               =   repo.distinct("format",self.db,self.col)
                    filter["values"]        =   self.get_formated_data(formatres)
                if filter["filter"]         ==  "channel":
                    channelres              =   repo.distinct("channel",self.db,self.col)
                    filter["values"]        =   self.get_formated_data(channelres)
                if filter["filter"]         ==  "samplingRate":
                    srateres                =   repo.distinct("samplingRate",self.db,self.col)
                    filter["values"]        =   self.get_formated_data(srateres)
                if filter["filter"]         ==  "bitsPerSample":
                    bpsres                  =   repo.distinct("bitsPerSample",self.db,self.col)
                    filter["values"]        =   self.get_formated_data(bpsres)
                if filter["filter"]         ==  "numberOfSpeakers":
                    speakercountres         =   repo.distinct("numberOfSpeakers",self.db,self.col)
                    filter["values"]        =   self.get_formated_data(speakercountres)
                if filter["filter"]         ==  "gender":
                    genderres               =   repo.distinct("gender",self.db,self.col)
                    filter["values"]        =   self.get_formated_data(genderres)
                if filter["filter"]         ==  "dialect":
                    dialectres              =   repo.distinct("dialect",self.db,self.col)
                    filter["values"]        =   self.get_formated_data(dialectres)
                if filter["filter"]         ==  "snrTool":
                    srateres                =   repo.distinct("snr.methodDetails.snrTool",self.db,self.col)
                    filter["values"]        =   self.get_formated_data(srateres)
                if filter["filter"]         ==  "samplingRate":
                    snrtoolres              =   repo.distinct("snrtoolres",self.db,self.col)
                    filter["values"]        =   self.get_formated_data(snrtoolres)
            return asr_data
        except Exception as e:
            log.info(f"Exception on AsrModel :{e}")


    
    def get_language_filter(self,lang_list):
        log.info("formatting language filter")
        values = []
        for data in lang_list:
            attribute = {}
            attribute["value"] = data
            attribute["label"] = LANG_CODES.get(data)
            values.append(attribute)
        return values

    def get_collection_details(self,collection_data):
        log.info("formatting collection method,details filter")
        values = []
        for data in collection_data:
            collection = {}
            collection["value"] = data["_id"]
            collection["label"] = str(data["_id"]).title()
            tools = []

            for obj in data["details"]:
                if "asrModel" in obj:
                    tools.append({"asrModel":obj["asrModel"]})
                 
                if "evaluationMethod" in obj:
                    tools.append({"evaluationMethod":obj["evaluationMethod"]})

                if "alignmentTool" in obj:
                    tools.append({"alignmentTool":obj["alignmentTool"]})
            
            collection["tool/method"] = [i for n, i in enumerate(tools) if i not in tools[n + 1:]]
            values.append(collection)
        return values

    def get_formated_data(self, attribute_data):
        log.info("formatting filter attribute")
        values = []
        for data in attribute_data:
            attribute = {}
            attribute["value"] = data
            attribute["label"] = str(data).title()
            values.append(attribute)
        return values

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
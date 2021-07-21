import logging
import json
import csv
import requests
from configs.configs import file_store_host,file_store_upload_endpoint,pt_publish_tool
from logging.config import dictConfig
log = logging.getLogger('file')




class StoreUtils:

    #method to write on csv file
    def write_to_csv(self, data_list, file, srn):
        try:
            data_modified, data_pub = [], None
            for data in data_list:
                if isinstance(data, str):
                    data = json.loads(data)
                if 'stage' in data.keys():
                    if data["stage"] == pt_publish_tool:
                        data_pub = data
                data_modified.append(data)
            if not data_pub:
                data_pub = data_modified[-1]
            with open(file, 'w', newline='') as output_file:
                dict_writer = csv.DictWriter(output_file, list(data_pub.keys()))
                dict_writer.writeheader()
                dict_writer.writerows(data_modified)
                output_file.close()
            log.info(f'{len(data_modified)} Errors written to csv for SRN -- {srn}')
            return
        except Exception as e:
            log.exception(f'Exception in csv writer: {e}')
            return

    #triggering file-store api call 
    def file_store_upload_call(self, file,file_name ,folder_name):
        try:
            headers =   {"Content-Type": "application/json"}
            body    =   {"fileName":file_name,"storageFolder":folder_name,"fileLocation":file}
            request_url = file_store_host+file_store_upload_endpoint
            log.info("Intiating request to store data on object store %s"%request_url)
            response = requests.post(url=request_url, headers = headers, json = body)
            response_data = response.content
            log.info("Received data from upload end point of file store service")
            response = json.loads(response_data)
            if "data" not in response:
                return False
            return response["data"]
        except Exception as e:
            log.exception(f'Exception while pushing error file to object store: {e}')
        return False

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

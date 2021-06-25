from models.abstract_handler import BaseValidator
from configs.configs import dataset_type_parallel, dataset_type_asr, dataset_type_ocr, dataset_type_monolingual, shared_storage_path
import hashlib
import logging
from logging.config import dictConfig
log = logging.getLogger('file')

class CaseDedup(BaseValidator):
    """
    Stores the hash for sentence with all lower case to facilitate deduplication based on case
    """

    def create_hash(self, text, lang):
        if lang == 'en':
            text = text.lower()
        return str(hashlib.sha256(text.encode('utf-16')).hexdigest())

    def hash_file(self, filename):
        h = hashlib.sha256()
        try:
            with open(filename, 'rb') as file:
                chunk = 0
                while chunk != b'':
                    chunk = file.read(1024)
                    h.update(chunk)
            return h.hexdigest()
        except Exception as e:
            log.exception(e)
            return None

    def execute(self, request):
        log.info('----Adding hash for sentences----')
        try:
            if request["datasetType"] == dataset_type_parallel:
                request['record']['sourceTextHash'] = self.create_hash(request['record']['sourceText'], request['record']['sourceLanguage'])
                request['record']['targetTextHash'] = self.create_hash(request['record']['targetText'], request['record']['targetLanguage'])
            if request["datasetType"] == dataset_type_asr:
                audio_file = request['record']['fileLocation']
                #file_path = f'{shared_storage_path}{audio_file}'
                request['record']['audioHash'] = self.hash_file(audio_file)
                request['record']['textHash'] = self.create_hash(request['record']['text'], request['record']['sourceLanguage'])
            if request["datasetType"] == dataset_type_ocr:
                image_file = request['record']['fileLocation']
                request['record']['imageHash'] = self.hash_file(image_file)
                request['record']['groundTruthHash'] = self.create_hash(request['record']['groundTruth'], request['record']['sourceLanguage'])
            if request["datasetType"] == dataset_type_monolingual:
                request['record']['textHash'] = self.create_hash(request['record']['text'], request['record']['sourceLanguage'])

            return super().execute(request)
        except Exception as e:
            log.exception('Exception while adding hash values for sentences', e)
            return {"message": "Exception while adding hash values for sentences", "code": "SERVER_PROCESSING_ERROR", "status": "FAILED"}


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
package com.ulca.benchmark.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Example;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.ulca.benchmark.dao.BenchmarkDao;
import com.ulca.benchmark.request.BenchmarkSearchRequest;
import com.ulca.benchmark.request.BenchmarkSearchResponse;
import com.ulca.benchmark.request.ExecuteBenchmarkRequest;
import com.ulca.benchmark.request.ExecuteBenchmarkResponse;

import io.swagger.model.Benchmark;
import io.swagger.model.ModelTask;
import io.swagger.model.ModelTask.TypeEnum;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class BenchmarkService {

	@Autowired
	private KafkaTemplate<String, ExecuteBenchmarkRequest> benchmarkDownloadKafkaTemplate;

	@Value("${kafka.ulca.bm.filedownload.ip.topic}")
	private String benchmarkDownloadTopic;

	@Autowired
	BenchmarkDao benchmarkDao;

	public Benchmark submitBenchmark(Benchmark benchmark) {

		benchmarkDao.save(benchmark);
		return benchmark;
	}

	public ExecuteBenchmarkResponse executeBenchmark(ExecuteBenchmarkRequest request) {

		log.info("******** Entry BenchmarkService:: executeBenchmark *******");
		
		ExecuteBenchmarkResponse response = new ExecuteBenchmarkResponse();
		benchmarkDownloadKafkaTemplate.send(benchmarkDownloadTopic, request);

		log.info(request.toString());
		log.info(request.getModelId());
		log.info(request.getBenchmarks().toString());

		log.info(request.getBenchmarks().get(0).getBenchmarkId());

		log.info("******** Exit BenchmarkService:: executeBenchmark *******");
		
		return response;

	}

	public BenchmarkSearchResponse listByTaskID(BenchmarkSearchRequest request) {

		log.info("******** Entry BenchmarkService:: listByTaskID *******"); 
		
		BenchmarkSearchResponse response = null;
		Benchmark benchmark = new Benchmark();
		if (request.getTask() != null && !request.getTask().isBlank()) {
			ModelTask modelTask = new ModelTask();
			modelTask.setType(TypeEnum.fromValue(request.getTask()));
			benchmark.setTask(modelTask);
		}
		if (request.getDomain() != null) {
			benchmark.setDomain(request.getDomain());
		}
		Example<Benchmark> example = Example.of(benchmark);
		List<Benchmark> list = benchmarkDao.findAll(example);
		
		List<String> metric = null;
		if(request.getTask() != null && !request.getTask().isBlank()) {
			metric = getMetric(request.getTask());
		}
		response = new BenchmarkSearchResponse("Benchmark Search Result", list,metric, list.size());


		log.info("******** Exit BenchmarkService:: listByTaskID *******"); 
		
		return response;
	}
	
	private List<String> getMetric(String task) {
		
		String[] metric = null;
		
        
        if(task.equalsIgnoreCase("translation")) {
        	metric = new String[]{"bleu", "sacrebleu","meteor", "lepor"} ;
        	
        	return Arrays.asList(metric);
        }
        
        
        if(task.equalsIgnoreCase("asr")) {
        	
             
        	metric = new String[]{"wer", "cer"} ;
        	
        	return Arrays.asList(metric);
        }
        
        if(task.equalsIgnoreCase("document-layout")) {
        	
        	
            
        	metric = new String[]{"precision", "recall","h1-mean"} ;
        	
        	return Arrays.asList(metric);
        }
        if(task.equalsIgnoreCase("ocr")) {
        	metric = new String[]{"wer", "cer"} ;
        	
        	return Arrays.asList(metric);
        }
        
        return null;
	}

}

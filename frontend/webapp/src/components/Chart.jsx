import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { withStyles, Typography, MuiThemeProvider, Paper, Button } from "@material-ui/core";
import ChartStyles from "../styles/Dashboard";
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, LabelList, YAxis, Tooltip } from 'recharts';
import FetchLanguageDataSets from "../actions/FetchLanguageDataSets";
import { ArrowBack } from '@material-ui/icons';
import Dataset from "../configs/DatasetItems";
import TitleBar from "./TitleBar";
var colors = ["188efc", "7a47a4", "b93e94", "1fc6a4", "f46154", "d088fd", "f3447d", "188efc", "f48734", "189ac9", "0e67bd"]


const ChartRender = (props) => {
	const [selectedOption, setSelectedOption] = useState(Dataset[0]);
	const [count, setCount] = useState(0);
	const [title, setTitle] = useState("Number of parallel dataset per language with English");
	const [filterValue, setFilterValue] = useState("domains");
  const [data, setData] = useState([]);
	const [selectedLanguage, setSelectedLanguage] = useState("");
	const [selectedLanguageName, setSelectedLanguageName] = useState("");
	const [page, setPage] = useState(0);

  useEffect(() => {
    fetchChartData(selectedOption.value, "languagePairs", [])
      
  }, []);

	const { classes } = props;
	const options = Dataset;
	

  const fetchChartData = async (dataType, value, criterions) => {
    let apiObj = new FetchLanguageDataSets(dataType, value, criterions);
        fetch(apiObj.apiEndPoint(), {
          method: 'post',
          body: JSON.stringify(apiObj.getBody()),
          headers: apiObj.getHeaders().headers
        }).then(async response => {
          const rsp_data = await response.json();
          if (!response.ok) {
            return Promise.reject('');
          } else {
            let res = rsp_data.data.sort((a,b)=>b.value-a.value)
            setData(res)
			let total = rsp_data.data.reduce((acc,rem)=> acc= acc+Number(rem.value),0)
			setCount(total)
          }
        }).catch((error) => { 
        }); 
    }


	const fetchParams = (event) => {
		var sourceLanguage = ""
		let targetLanguage = ""
		if (selectedOption.value === "parallel-corpus") {
			sourceLanguage = { "type": "PARAMS", "value": "en" };
			targetLanguage = { "type": "PARAMS", "value": (selectedLanguage ? selectedLanguage : event && event.hasOwnProperty("_id") && event._id) }
		}
		else {
			sourceLanguage = { "type": "PARAMS", "value": (selectedLanguage ? selectedLanguage : event && event.hasOwnProperty("_id") && event._id) };
			targetLanguage = { "type": "PARAMS", "value": "" };

		}
		setSelectedLanguage(selectedLanguage ? selectedLanguage : event && event.hasOwnProperty("_id") && event._id)
		setSelectedLanguageName(selectedLanguageName ? selectedLanguageName : event && event.hasOwnProperty("label") && event.label)
		return ([{ "type": "PARAMS", "sourceLanguage": sourceLanguage, "targetLanguage": targetLanguage }])
	}

	const fetchNextParams = (eventValue) => {
		var sourceLanguage = ""
		let targetLanguage = ""
		let event = { "type": "PARAMS", "value": eventValue && eventValue.hasOwnProperty("_id") && eventValue._id }
		if (selectedOption.value === "parallel-corpus") {
			sourceLanguage = { "type": "PARAMS", "value": "en" };
			targetLanguage = { "type": "PARAMS", "value": selectedLanguage }
		}
		else {
			sourceLanguage = { "type": "PARAMS", "value": selectedLanguage };
			targetLanguage = { "type": "PARAMS", "value": "" };

		}
		setSelectedLanguage(selectedLanguage ? selectedLanguage : event && event.hasOwnProperty("_id") && event._id)
		setSelectedLanguageName(selectedLanguageName ? selectedLanguageName : event && event.hasOwnProperty("label") && event.label)
		return ([{ "type": "PARAMS", "sourceLanguage": sourceLanguage, "targetLanguage": targetLanguage }, event])
	}

	const handleOnClick = (value, event, filter) => {
		switch (value) {
			case 1:
				fetchChartData(selectedOption.value, filter ? filter : filterValue, fetchParams(event))
				handleSelectChange(selectedOption, event, filter, value)
				setPage(value)
				break;
			case 2:
				fetchChartData(selectedOption.value, filterValue === "collectionMethod_collectionDescriptions" ? "domains" : "collectionMethod_collectionDescriptions", fetchNextParams(event))
				setPage(value)
				setFilterValue('domains')
				handleSelectChange(selectedOption, event, filter, value)
				break;
			case 0:
				fetchChartData(selectedOption.value, "languagePairs", [])
				setPage(value)
				setFilterValue('domains')
				handleSelectChange(selectedOption, "", "", value)
				setSelectedLanguage("")
				setSelectedLanguageName("")
				break;
			default:
		}
	}

	const handleLanguageChange = (value) => {
		setFilterValue(value)
		setTitle(`English-${selectedLanguageName}  ${selectedOption.value}- Grouped by ${(value === "domains") ? "Domain" : (value === "source") ? "Source" : value === "collectionMethod_collectionDescriptions" ? "Collection Method" : "Domain"}`)
		handleOnClick(1, "", value)
	}
	const handleCardNavigation = () => {
		handleOnClick(page - 1)
	}

	const fetchFilterButtons = () => {
		return (
			<div className={classes.filterButton}>
				<Button color={filterValue === "domains" ? "primary" : "default"}  size="small" variant="outlined" className={classes.backButton} onClick={() => handleLanguageChange("domains")}>Domain</Button>
				<Button color={filterValue === "collectionMethod_collectionDescriptions" ? "primary" : "default"}  size="small" variant="outlined" onClick={() => handleLanguageChange("collectionMethod_collectionDescriptions")}>Collection Method</Button>

			</div>
		)
	}

	const handleSelectChange = (dataSet, event, filter, page) => {
		setSelectedOption(dataSet)
		switch (dataSet.value) {
			case 'parallel-corpus':
				if (page === 0) {
					setTitle("Number of parallel sentences per language with English")
					selectedOption.value !== dataSet.value && fetchChartData(dataSet.value, "languagePairs", [])

				} else if (page === 1) {
					setTitle(`English-${selectedLanguageName ? selectedLanguageName : event && event.hasOwnProperty("label") && event.label}  ${selectedOption.label} - Grouped by ${(filter === "domains") ? "Domain" : (filter === "source") ? "Source" : filter === "collectionMethod_collectionDescriptions" ? "Collection Method" : "Domain"}`)

				} else if (page === 2) {
					setTitle(`English-${selectedLanguageName} ${selectedOption.label} `)
				}

				break;
			case 'monolingual-corpus':
				if (page === 0) {
					selectedOption.value !== dataSet.value && fetchChartData(dataSet.value, "languagePairs", [])
					setTitle('Number of sentences per language')
				} else if (page === 1) {
					setTitle(`Number of sentences in ${selectedLanguageName ? selectedLanguageName : event && event.hasOwnProperty("label") && event.label} - Grouped by ${(filter === "domains") ? "Domain" : (filter === "source") ? "Source" : filter === "collectionMethod_collectionDescriptions" ? "Collection Method" : "Domain"}`)
				} else if (page === 2) {
					setTitle(`Number of sentences in ${selectedLanguageName} `)
				}
				
				break;
			case 'asr-corpus':
				if (page === 0) {
					selectedOption.value !== dataSet.value && fetchChartData(dataSet.value, "languagePairs", [])
					setTitle("Number of audio hours per language")
				} else if (page === 1) {
					setTitle(`Number of audio hours in ${selectedLanguageName ? selectedLanguageName : event && event.hasOwnProperty("label") && event.label} - Grouped by ${(filter === "domains") ? "Domain" : (filter === "source") ? "Source" : filter === "collectionMethod_collectionDescriptions" ? "Collection Method" : "Domain"}`)
				} else if (page === 2) {
					setTitle(`Number of audio hours in ${selectedLanguageName} `)
				}

				break;
			case 'ocr-corpus':

				if (page === 0) {
					selectedOption.value !== dataSet.value && fetchChartData(dataSet.value, "languagePairs", [])
					setTitle("Number of images per language")
				} else if (page === 1) {
					setTitle(`Number of images with ${selectedLanguageName ? selectedLanguageName : event && event.hasOwnProperty("label") && event.label} text - Grouped by ${(filter === "domains") ? "Domain" : (filter === "source") ? "Source" : filter === "collectionMethod_collectionDescriptions" ? "Collection Method" : "Domain"}`)
				} else if (page === 2) {
					setTitle(`Number of images with ${selectedLanguageName} text`)
				}

				break;
			default:
				setTitle("")
		}
	}
	debugger
	return (
			<div className={classes.container}>
				<Paper elevation={0} className={classes.paper}>	
				
        <TitleBar selectedOption=	{selectedOption}
				handleSelectChange=	{handleSelectChange}
				options		=	{options}
				isDisabled	=	{page !== 0 ? true : false}
				page		= 	{page}
				count 		= 	{count}
				>
				{page === 1 && fetchFilterButtons()}
				
			</ TitleBar>
					<div className={classes.iconStyle}>
					 	<><Button size="small" color="primary" className={classes.backButton} style={page === 0 ? {visibility:"hidden"}:{}} startIcon={<ArrowBack />} onClick={() => handleCardNavigation()}>Back</Button></>
						<Typography className={classes.titleText} value="" variant="h6"> {title} </Typography>	
					</div>
					
					<div className={classes.title}>
						<ResponsiveContainer width="95%" height={550} >
						<BarChart width={900} height={350} data={data} fontSize="14px" fontFamily="Roboto" maxBarSize={100} >
								<XAxis dataKey="label" textAnchor={"end"} tick={data.length> 0 ?{ angle: -30, marginTop: "8px" }: false} height={130} interval={0} position="insideLeft"></XAxis>
								<YAxis padding={{ top: 10 }} tickInterval={10} allowDecimals={false} type="number" dx={0} tickFormatter={(value) => new Intl.NumberFormat('en', { notation: "compact" }).format(value)} />
								<Tooltip contentStyle={{fontFamily:"Roboto", fontSize:"14px"}} formatter={(value) => new Intl.NumberFormat('en').format(value)} cursor={{ fill: 'none' }} />
								<Bar margin={{ top: 40, left: 20, right: 20, bottom: 20 }} dataKey="value" cursor="pointer" radius={[8, 8, 0, 0]} maxBarSize={65} onClick={(event) => { handleOnClick(page + 1, event) }}>
									<LabelList
										formatter={(value) => new Intl.NumberFormat('en').format(value)} cursor={{ fill: 'none' }}
										position="top"
										dataKey="value"
										fill="black"
									/>
									 {
										data.length > 0 && data.map((entry, index) => {
											const color = colors[index < 9 ? index : index % 10]
											return <Cell key={index} fill={`#${color}`} />;
										})
									} 
								 </Bar>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</Paper> 
			</div>	
	)
}
export default withStyles(ChartStyles())(ChartRender);
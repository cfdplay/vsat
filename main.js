	

/*=============public variables================*/
 			var itemArray=new Array();
            var stopArray=new Array();
            var pauseArray=new Array();
            var skipArray=new Array();
            var learnerArray=new Array();
            var timeZoneArray=new Array();
            var timeZoneArray2=new Array();
			var tableArray=new Array();
			var smallItemArray=new Array();
			//variables of second videofor video compare=
			var stopArray2=new Array();
			var pauseArray2=new Array();
			var skipArray2=new Array();
			var learnerArray2=new Array();
			var stopTimes2=0;
        	var pauseTimes2=0;
        	var skipTimes2=0;
			var itemArray2=new Array();
			var smallItemArray2=new Array();
			         
            var chart;
          	var fName;
			var fName2;
            var sectionNumber=15;
            var stopTimes=0;
            var pauseTimes=0;
            var skipTimes=0;
            var maxTime=300;
            var interval=20;  
            var colorStop="#3b97d3";
            var colorPause="#b7b7b7";
            var colorSkip="#FF9900";  
            var colorTime="";  
            var colorTableBack=""; 
			var currentActionId;
			var currentActionName;
         
		//Fill blank chart     
		google.charts.load('current', {packages: ['corechart', 'bar']});
    	google.charts.setOnLoadCallback(drawBlankChart); 
             
         //set the timeZoneArray2
		 var timeZoneStart=60;
         var timeZoneEnd=timeZoneStart+interval;
		 for(i=0;i<sectionNumber;i++)
         {
         	timeFrameString=convertTime(timeZoneStart);
           	timeZoneArray2[i]=convertTime(timeZoneStart);
            timeZoneStart=timeZoneEnd;
           	timeZoneEnd=timeZoneEnd+interval;
        }
              
        //insert a blank chart
		google.charts.load('current', {packages: ['corechart', 'bar']});
        google.charts.setOnLoadCallback(drawBlankChart); 
   		
//=======================function to initialize the page=================================
function init()
{
	//set the interactin drop down
	document.getElementById("action").selectedIndex=3;   
}

//==============function to check file selection checked status===================
function fileCheckStatus()
{
	var check1=document.getElementById('fileCheck1').checked;
	var check2=document.getElementById('fileCheck2').checked;
	var status=0;
	
	if(check1==false && check2==false){status=1;} //no video checked
	else if(check1==true && check2==false){status=2;} //video 1 checked only
	else if(check1==false && check2==true){status=3;} //video 2 checked only
	else if(check1==true && check2==true){status=4;}  //both video checked
	return status;
}

//control the learners list according to checkbox status
function statusChange(){
	var status=fileCheckStatus();
	if(status==1)
	{
		 document.getElementById('learner').selectedIndex=0;
		 document.getElementById('learner').disabled=true;
		 document.getElementById('learner2').selectedIndex=0;
		 document.getElementById('learner2').disabled=true;
	}
	else if(status==4)
	{
		 document.getElementById('learner').disabled=true;
		 document.getElementById('learner2').disabled=true;
	}
	else if(status==2)
	{
		 document.getElementById('learner').disabled=false;
		 document.getElementById('learner2').disabled=true;
	}
	else if(status=3)
	{
		 document.getElementById('learner2').disabled=false;
		 document.getElementById('learner').disabled=true;	
	}
							   
}

//=================function to build the learners' dropdown list===========
function fillLearnerList(fileNo)
{		
	var selectLearner = document.getElementById("learner");
	var selectLearner2 = document.getElementById("learner2");
	//for video file 1, fill the learnerlist when import the file
	if(fileNo==1)
	{
	 	for (i = 0; i < selectLearner.options.length; i++) 
         {
  			selectLearner.removeChild(selectLearner.options[i]);   
		 }
		 
		//Then build the all option
		var option = document.createElement('option');
   		option.text = "All";
   		option.value = "all";
   		selectLearner.add(option, 0);
		for(var i=0;i<learnerArray.length;i++)
		{
            		var option = document.createElement('option');
   					option.text = "Video1_Learner "+(i+1).toString();;
   					option.value = learnerArray[i]; //this value is the real learner's id in the file
    				selectLearner.add(option, i+1);
    	}
		selectLearner.selectedIndex = 0;		
	} 
	else if(fileNo==2)
	{
		for (i = 0; i < selectLearner2.options.length; i++) 
         {
  			selectLearner2.removeChild(selectLearner2.options[i]);   
		 }
		
		 //Then build the all option
		 var option = document.createElement('option');
   		 option.text = "All";
   		 option.value = "all";
   		 selectLearner2.add(option, 0);
		 
		 for(var i=0;i<learnerArray2.length;i++)
		 {	  
            	var option = document.createElement('option');
   				option.text = "Video2_Learner "+(i+1).toString();;
   				option.value = learnerArray2[i]; //this value is the real learner's id in the file
    			selectLearner2.add(option, i+1);
    	 }
		 selectLearner2.selectedIndex = 0;		
	}
}

//================Function to read the csv video file, build the learner list============
function readCsvFile(e)
{  	
   	var fileNo;
 	//read the csv file, identify which video file is imported
    var f = document.getElementById(e.id).files[0];
	if(e.id=="csvFile1"){fileNo=1;}
	else if(e.id=="csvFile2"){fileNo=2};
    var reader = new FileReader();
	
    //if successfully read, put the data item in an array "item array" for use in the whole program
	reader.onload = function()
    {  
		//for the file 1
		if(fileNo==1){
			fName=f.name;
			var wholeContent=reader.result;
			//clear the itemArray before filling the data
       	 	itemArray=[];
			//build the item array of the file
			itemArray=wholeContent.split(/[\n,]/); 
			smallItemArray=[];
			smallContent="";
			learnerArray=[];
			var learnerName="";
        	var learnerCount=0;
			//go through the video csv file
     		for(var i=0;i<itemArray.length;i=i+10)
     		{  			
				//construc the smallItemArray
				smallContent+=itemArray[i+1]+",";
				smallContent+=itemArray[i+2]+",";
				smallContent+=itemArray[i+4]+"\n";
						
				//construct the learners array
				//control the amount of the learners in the learner list to 200
            	if(learnerArray.length<200)
            	{
					learnerName=itemArray[i+1];
					var isOld=false;
					//check if the learner is in the array already or not
					for(var j=0;j<learnerArray.length;j++)
            		{
                		if(learnerName==learnerArray[j])
                		{	
                    		isOld=true;
                    		break;
                 		}
						//if it is a new learner, add it to the learner array
            		} 
					if(isOld==false)
            		{
                 		learnerArray.push(learnerName);   		
            		}
            	}
      		}
			smallItemArray=smallContent.split(/[\n,]/);
		} //for file 2
		else if(fileNo==2){
			fName2=f.name;
			var wholeContent=reader.result;
			//clear the itemArray before filling the data
       	 	itemArray2=[];
			//build the item array of the file
			itemArray2=wholeContent.split(/[\n,]/); 
			smallContent2="";
			smallItemArray2=[];
			learnerArray2=[];
			
			var learnerName="";
        	var learnerCount2=0;
			//go through the video csv file, calculate the numbers of stop,pause and skip for a purticular user or all users
     		for(var i=0;i<itemArray2.length;i=i+10)
     		{    				
				//construc the smallItemArray
				smallContent2+=itemArray2[i+1]+",";
				smallContent2+=itemArray2[i+2]+",";
				smallContent2+=itemArray2[i+4]+"\n";
				
				//construct the learners array
				//control the amount of the learners in the learner list to 200
            	if(learnerArray2.length<=200)
            	{
					learnerName=itemArray2[i+1];
					var isOld=false;
					//check if the learner is in the array already or not
					for(var j=0;j<learnerArray2.length;j++)
            		{
                		if(learnerName==learnerArray2[j])
                		{	
                    		isOld=true;
                    		break;
                 		}
						//if it is a new learner, add it to the learner array
            		}
					if(isOld==false)
            		{
                 		learnerArray2.push(learnerName);
                 		learnerCount2++;    		
            		}
            	}  
      		}
			smallItemArray2=smallContent2.split(/[\n,]/);
			
		
		}		
		fillLearnerList(fileNo);
	}     
    reader.readAsText(f); 
}
       

//=============================function to draw a blank chart and table===============================
function drawBlankChart() 
{   
   //create the google chart data table           
   var data2 = new google.visualization.DataTable(); 
                 
   //build the datatable 
   //x axis,same for all cases
   data2.addColumn('string', 'time');   
                    
   //y axis
   data2.addColumn('number', 'None');
   for(i=0;i<sectionNumber;i++)
   {
   		data2.addRows([['-',0]]);
   }
   //chart parameters
   var options = {
       title: 'Amount of Video Interactions over video time',
       isStacked: true,
       hAxis: {title: 'Video Time'},
       vAxis: {title: 'Amount of Video Interactions'},
       width: 1000,
       height: 400,
       pointSize:5
   };
    chart2 = new google.visualization.LineChart(document.getElementById('divChart'));
    chart2.draw(data2, options);
}		
           
//=============================function to draw chart and table=================================

function drawChart1( ) 
{
	var status=fileCheckStatus();
	
	//draw the chart according to different check box selection
	switch(status) 
	{
    	case 1: //neither checked
			alert("Please check a video for analytics");
        	return; 

		case 2: //file 1 checked only
	 		if(document.getElementById('csvFile1').files.length==0)
     		{	   
		   		alert("No video file for video 1 imported. Please select a file for video 1.");
           		return;
     		}
		
			//initialize the stop ,pause,skip array
			for(i=0;i<sectionNumber;i++)
     		{	
           		stopArray[i]=0;
           		pauseArray[i]=0;
           		skipArray[i]=0;
     		}
     		stopTimes=0;
     		pauseTimes=0;
     		skipTimes=0;
			//Get the learnerID chosen by the user
     		var learnerChosen=document.getElementById('learner').value;
		
    		//go through the video csv file, calculate the numbers of stop,pause and skip for a purticular user or all users
		
            for(var i=0;i<smallItemArray.length;i=i+3)
            {                   
                	 //get the time zone of the interaction
                     var timeZone=Math.floor(parseFloat(smallItemArray[i+2])/interval);
                     //get the interation type
                     var actionType=smallItemArray[i+1];
                     //get the learnerID
                     var learnerId=smallItemArray[i];
                     //time when the interactioin happened
                     var currentTime=parseFloat(smallItemArray[i+2]);
                     //
                     if((learnerChosen=="all" || learnerChosen==learnerId ) && currentTime>60 && currentTime<300)
                     {
						
                        switch(actionType)
                        {
                            case 'pause_video':
                            pauseArray[timeZone]=pauseArray[timeZone]+1;
                            pauseTimes= pauseTimes+1;
                            break;
                            case 'stop_video':
                            stopArray[timeZone]= stopArray[timeZone]+1;
                            stopTimes=stopTimes+1;
                            break;
                            case 'seek_video':
                            skipArray[timeZone]= skipArray[timeZone]+1;
                            skipTimes=skipTimes+1;
                            break;
                        }
                      }
                }
			break;
		case 3: //file 2 checked only
			if(document.getElementById('csvFile2').files.length==0)
     		{	   
		   		alert("No video file for video 2 imported. Please select a file for video 2.");
           		return;
     		}
			//initialize the stop ,pause,skip array
			for(i=0;i<sectionNumber;i++)
     		{	
           		stopArray2[i]=0;
           		pauseArray2[i]=0;
           		skipArray2[i]=0;
     		}
     		stopTimes2=0;
     		pauseTimes2=0;
     		skipTimes2=0;
			
			//Get the learnerID chosen by the user
     		var learnerChosen=document.getElementById('learner2').value;
    		//go through the video csv file, calculate the numbers of stop,pause and skip for a purticular user or all users
            for(var i=0;i<smallItemArray2.length;i=i+3)
            {                   
                	 //get the time zone of the interaction
                     var timeZone=Math.floor(parseFloat(smallItemArray2[i+2])/interval);
                     //get the interation type
                     var actionType=smallItemArray2[i+1];
                     //get the learnerID
                     var learnerId=smallItemArray2[i];
                     //time when the interactioin happened
                     var currentTime=parseFloat(smallItemArray2[i+2]);
                     //
                     if((learnerChosen=="all" || learnerChosen==learnerId ) && currentTime>60 && currentTime<300)
                     {
						
                        switch(actionType)
                        {
                            case 'pause_video':
							
                            pauseArray2[timeZone]=pauseArray2[timeZone]+1;
                            pauseTimes2= pauseTimes2+1;
                            break;
                            case 'stop_video':
                            stopArray2[timeZone]= stopArray2[timeZone]+1;
                            stopTimes2=stopTimes2+1;
                            break;
                            case 'seek_video':
                            skipArray2[timeZone]= skipArray2[timeZone]+1;
                            skipTimes2=skipTimes2+1;
                            break;
                        }
                      }
                }
			break;

		case 4: //both checked
			if(document.getElementById('csvFile2').files.length==0 || document.getElementById('csvFile1').files.length==0)
     		{	   
		   		alert("No files imported. Please impoort files for video 1 and video 2.");
				return;
     		}
			//video 1
			for(i=0;i<sectionNumber;i++)
     		{	
           		stopArray[i]=0;
           		pauseArray[i]=0;
           		skipArray[i]=0;
     		}
     		stopTimes=0;
     		pauseTimes=0;
     		skipTimes=0;
		
    		//go through the video csv file, calculate the numbers of stop,pause and skip for a purticular user or all users
		
            for(var i=0;i<smallItemArray.length;i=i+3)
            {                   
                	 //get the time zone of the interaction
                     var timeZone=Math.floor(parseFloat(smallItemArray[i+2])/interval);
                     //get the interation type
                     var actionType=smallItemArray[i+1];
                     //get the learnerID
                     var learnerId=smallItemArray[i];
                     //time when the interactioin happened
                     var currentTime=parseFloat(smallItemArray[i+2]);
                     //
                     if(currentTime>60 && currentTime<300)
                     {
						
                        switch(actionType)
                        {
                            case 'pause_video':
                            pauseArray[timeZone]=pauseArray[timeZone]+1;
                            pauseTimes= pauseTimes+1;
                            break;
                            case 'stop_video':
                            stopArray[timeZone]= stopArray[timeZone]+1;
                            stopTimes=stopTimes+1;
                            break;
                            case 'seek_video':
                            skipArray[timeZone]= skipArray[timeZone]+1;
                            skipTimes=skipTimes+1;
                            break;
                        }
                      }
                }
			//video 2
			for(i=0;i<sectionNumber;i++)
     		{	
           		stopArray2[i]=0;
           		pauseArray2[i]=0;
           		skipArray2[i]=0;
     		}
     		stopTimes2=0;
     		pauseTimes2=0;
     		skipTimes2=0;
    		//go through the video csv file, calculate the numbers of stop,pause and skip for a purticular user or all users
            for(var i=0;i<smallItemArray2.length;i=i+3)
            {                   
                	 //get the time zone of the interaction
                     var timeZone=Math.floor(parseFloat(smallItemArray2[i+2])/interval);
                     //get the interation type
                     var actionType=smallItemArray2[i+1];
                     //get the learnerID
                     var learnerId=smallItemArray2[i];
                     //time when the interactioin happened
                     var currentTime=parseFloat(smallItemArray2[i+2]);
                     //
                     if(currentTime>60 && currentTime<300)
                     {
						
                        switch(actionType)
                        {
                            case 'pause_video':
							
                            pauseArray2[timeZone]=pauseArray2[timeZone]+1;
                            pauseTimes2= pauseTimes2+1;
                            break;
                            case 'stop_video':
                            stopArray2[timeZone]= stopArray2[timeZone]+1;
                            stopTimes2=stopTimes2+1;
                            break;
                            case 'seek_video':
                            skipArray2[timeZone]= skipArray2[timeZone]+1;
                            skipTimes2=skipTimes2+1;
                            break;
                        }
                      }
                }
			break;
    	default:
        	return;
	}
		
    //create the google chart data table for chart the other for tooltips           
                var data = new google.visualization.DataTable(); 
                var timeZoneStart=0;
                var timeZoneEnd=interval;
                var actName;
                var lineColor="";
                
                //build the datatable 
                //x axis,same for all cases
                data.addColumn('string', 'time');
                
                //interaction type chosen
				var act=document.getElementById("action").selectedIndex;
				
				//add columns to the data table based on the interation type chose				
				//for "All"
                if(act==3)
				{
					if(status==2)
					{
                        actName="Stop, Pause, Skip";
                		//y axis
                		data.addColumn('number', 'stop');
                		data.addColumn('number', 'pasue');
                		data.addColumn('number', 'skip');
						for(i=0;i<sectionNumber;i++)
                    	{
							data.addRows([[timeZoneArray[i],stopArray[i],pauseArray[i],skipArray[i]]]);
						}
					}
					else if(status==3)
					{
						actName="Stop, Pause, Skip";
                		//y axis
                		data.addColumn('number', 'stop');
                		data.addColumn('number', 'pasue');
                		data.addColumn('number', 'skip');
						for(i=0;i<sectionNumber;i++)
                    	{
							data.addRows([[ timeZoneArray[i],stopArray2[i],pauseArray2[i],skipArray2[i] ]]);	
						}
					}
					else if(status==4)
					{
						
						actName="Stop, Pause, Skip";
                		//y axis
                		data.addColumn('number', 'Video1_stop');
                		data.addColumn('number', 'Video1_pasue');
                		data.addColumn('number', 'Video1_skip');
						data.addColumn('number', 'Video2_stop');
                		data.addColumn('number', 'Video2_pasue');
                		data.addColumn('number', 'Video2_skip');
						
						for(i=0;i<sectionNumber;i++)
                    	{									
							data.addRows([[timeZoneArray[i],stopArray[i],pauseArray[i],skipArray[i],stopArray2[i],pauseArray2[i],skipArray2[i]]]);
							
						}
					}
					lineColor=colorStop;
                }
                     
                //for "stop"
                else if(act==0)
                {
					if(status==2)
					{
						data.addColumn('number', 'Stop');
                        actName="Stop";
;
						for(i=0;i<sectionNumber;i++)
                    	{
							data.addRows([ [timeZoneArray[i],stopArray[i] ]]);
						}
					}
					else if(status==3)
					{
						actName="Stop";
                		//y axis
                		data.addColumn('number', 'stop');
						for(i=0;i<sectionNumber;i++)
                    	{
							data.addRows([[timeZoneArray[i],stopArray2[i] ]]);
						}
					}
					else if(status==4)
					{
						
						actName="Stop";
                		//y axis
                		data.addColumn('number', 'Video1_stop');
						data.addColumn('number', 'Video2_stop');
						for(i=0;i<sectionNumber;i++)
                    	{									
							data.addRows([[timeZoneArray[i],stopArray[i],stopArray2[i] ]]);				
						}
					}
					lineColor=colorStop;
                }
                //for "pause"
                else if(act==1)
                {
					if(status==2)
					{
						data.addColumn('number', 'pause');
                        actName="pause";
;
						for(i=0;i<sectionNumber;i++)
                    	{
							data.addRows([ [timeZoneArray[i],pauseArray[i] ]]);
						}
					}
					else if(status==3)
					{
						actName="pause";
                		//y axis
                		data.addColumn('number', 'pause');
						for(i=0;i<sectionNumber;i++)
                    	{
							data.addRows([[timeZoneArray[i],pauseArray2[i] ]]);
						}
					}
					else if(status==4)
					{
						
						actName="Pause";
                		//y axis
                		data.addColumn('number', 'Video1_pause');
						data.addColumn('number', 'Video2_pause');
						for(i=0;i<sectionNumber;i++)
                    	{									
							data.addRows([[timeZoneArray[i],pauseArray[i],pauseArray2[i] ]]);				
						}
					}
					lineColor=colorPause;
                }
                //for "skip"
                else if(act==2)
                {
                	if(status==2)
					{
						data.addColumn('number', 'skip');
                        actName="skip";
;
						for(i=0;i<sectionNumber;i++)
                    	{
							data.addRows([ [timeZoneArray[i],skipArray[i] ]]);
						}
					}
					else if(status==3)
					{
						actName="skip";
                		//y axis
                		data.addColumn('number', 'skip');
						for(i=0;i<sectionNumber;i++)
                    	{
							data.addRows([[timeZoneArray[i],skipArray2[i] ]]);
						}
					}
					else if(status==4)
					{
						
						actName="Pause";
                		//y axis
                		data.addColumn('number', 'Video1_skip');
						data.addColumn('number', 'Video2_skip');
						for(i=0;i<sectionNumber;i++)
                    	{									
							data.addRows([[timeZoneArray[i],skipArray[i],skipArray2[i] ]]);				
						}
					}
                    lineColor=colorSkip;
                }
			//draw the table
			 var optionsTable = {
				 showRowNumber: false, 
				 width:800,
				 height: 390
             };
			
             var table1 = new google.visualization.Table(document.getElementById('divTable'));
			 table1.draw(data, optionsTable);
             
			//=================================line Chart or Bar chart==============================    
			var chartTypeId=document.getElementById('chartType').selectedIndex;
			if(chartTypeId==0)
			{
                var options = {
                    title: 'Amount of Video Interactions ('+ actName + ') over video time',
                    isStacked: true,
                    hAxis: {title: 'Video Time',textStyle : {fontSize: 13}},
                    vAxis: {title: 'Amount of Video Interactions'},
                    width: 950,
                    height: 400,
                    colors: [lineColor,colorPause,'#FF9900'],
                    lineWidth: 4,
                    pointSize:5,
                    tooltip: {isHtml: true},
					series: {
            			3: { lineDashStyle: [2, 2] },
						4: { lineDashStyle: [2, 2] },
						5: { lineDashStyle: [2, 2] },
						}
					};
                chart = new google.visualization.LineChart(document.getElementById('divChart'));
                chart.draw(data, options);
            }
            else if(chartTypeId==1)
            {
            	var options = {
                    title: 'Amount of Video Interactions ('+ actName + ') over video time',
                    hAxis: {title: 'Video Time'},
                    vAxis: {title: 'Amount of Video Interactions'},
                    colors: [lineColor,colorPause,'#FF9900'],
                    width: 950,
                    height: 400,
                    tooltip: {isHtml: true}
           		};
				
 		   		chart = new google.visualization.ColumnChart(document.getElementById('divChart'));
           		chart.draw(data, options);	
            }  
			google.visualization.events.addListener(chart, 'select', function() {table1.setSelection(chart.getSelection());});
			google.visualization.events.addListener(table1, 'select', function() {chart.setSelection(table1.getSelection());});
		
			//fill the statistics
            fillSta(status);  	     				
}	


//=================================function to print the chart=====================================
function printChart()
{
				
	var windowPrint = window.open(chart.getImageURI(),"", "width=600,height=400");		
	windowPrint.focus();
    windowPrint.print();
    //windowPrint.close();
}

//=============================function to save the chart===================================

function saveChart(){
	download(chart.getImageURI(), 'fileName.png', "image/png");
}
		
/*===============function to convert time format==============*/            
 function convertTime(rawTime)
{
        var minute=Math.floor(rawTime/60);
        var second=rawTime%60;
        return minute.toString()+":"+second.toString();	
}
/*===============function to fill the statistics==============*/  
function fillSta(status)
{
			var spanF=document.getElementById("spanF");
			var spanL=document.getElementById("spanL");
			var spanI=document.getElementById("spanI");
			var spanA=document.getElementById("spanA");
	
			var spanF2=document.getElementById("spanF2");
			var spanL2=document.getElementById("spanL2");
			var spanI2=document.getElementById("spanI2");
			var spanA2=document.getElementById("spanA2");

			
			var a= document.getElementById("learner");
			var a2= document.getElementById("learner2");
			var b=document.getElementById("action");
			var c=document.getElementById("charType");
	
			if(status==2)
			{
				spanF.innerHTML=" "+fName;
				spanL.innerHTML=a.options[a.selectedIndex].text;
				spanI.innerHTML=b.options[b.selectedIndex].text;
				if(b.selectedIndex==0){spanA.innerHTML=stopTimes.toString();}
				else if(b.selectedIndex==1){spanA.innerHTML=pauseTimes.toString();}
				else if(b.selectedIndex==2){spanA.innerHTML=skipTimes.toString();}
				else if(b.selectedIndex==3)
				{
					spanA.innerHTML="Stop: "+stopTimes.toString()+ " , Pause: "+pauseTimes.toString()+" , Skip: " + skipTimes.toString(); 
				}
				spanF2.innerHTML="_";
				spanL2.innerHTML="_";
				spanI2.innerHTML="_";
				spanA2.innerHTML="_";
			}
			else if(status==3)
			{
				spanF2.innerHTML=" "+fName2;
				spanL2.innerHTML=a2.options[a2.selectedIndex].text;
				spanI2.innerHTML=b.options[b.selectedIndex].text;
				if(b.selectedIndex==0){spanA2.innerHTML=stopTimes2.toString();}
				else if(b.selectedIndex==1){spanA2.innerHTML=pauseTimes2.toString();}
				else if(b.selectedIndex==2){spanA2.innerHTML=skipTimes2.toString();}
				else if(b.selectedIndex==3)
				{
					spanA2.innerHTML="Stop: "+stopTimes2.toString()+ " , Pause: "+pauseTimes2.toString()+" , Skip: " + skipTimes2.toString(); 
				}
				spanF.innerHTML="_";
				spanL.innerHTML="_";
				spanI.innerHTML="_";
				spanA.innerHTML="_";
			}
			else if(status==4)
			{
				spanF.innerHTML=" "+fName;
				spanL.innerHTML=a.options[a.selectedIndex].text;
				spanI.innerHTML=b.options[b.selectedIndex].text;
				if(b.selectedIndex==0){spanA.innerHTML=stopTimes.toString();}
				else if(b.selectedIndex==1){spanA.innerHTML=pauseTimes.toString();}
				else if(b.selectedIndex==2){spanA.innerHTML=skipTimes.toString();}
				else if(b.selectedIndex==3)
				{
					spanA.innerHTML="Stop: "+stopTimes.toString()+ " , Pause: "+pauseTimes.toString()+" , Skip: " + skipTimes.toString(); 
				}
				spanF2.innerHTML=" "+fName2;
				spanL2.innerHTML=a2.options[a2.selectedIndex].text;
				spanI2.innerHTML=b.options[b.selectedIndex].text;
				if(b.selectedIndex==0){spanA2.innerHTML=stopTimes2.toString();}
				else if(b.selectedIndex==1){spanA2.innerHTML=pauseTimes2.toString();}
				else if(b.selectedIndex==2){spanA2.innerHTML=skipTimes2.toString();}
				else if(b.selectedIndex==3)
				{
					spanA2.innerHTML="Stop: "+stopTimes2.toString()+ " , Pause: "+pauseTimes2.toString()+" , Skip: " + skipTimes2.toString(); 
				}			
			}
}

/*==============function to create csv file==================*/
function createCsv(actionId) 
{  	
        var result,columnDelimiter, lineDelimiter,fileName;
        columnDelimiter = ',';
        lineDelimiter = '\n';
        result = '';
		
		switch(actionId)
        {			
          	case 0:
				result+="time_frame"+columnDelimiter+"stop_clicks"+lineDelimiter;
 		   		for(var i=0;i<timeZoneArray.length;i++) 
		   		{
			 		result += timeZoneArray[i]+columnDelimiter;
			 		result += stopArray[i].toString()+lineDelimiter;					
		   		} 
				fileName=fName+"_stop_STA.csv";
           		break;
           case 1:
				result+="time_frame"+columnDelimiter+"pause_clicks"+lineDelimiter;
				for(var i=0;i<timeZoneArray.length;i++) 
		   		{
			 		result += timeZoneArray[i]+columnDelimiter;
			 		result += pauseArray[i].toString()+lineDelimiter;
		   		} 
				fileName=fName+"_pause_STA.csv";
           		break;
           case 2:
				result+="time_frame"+columnDelimiter+"skip_clicks"+lineDelimiter;
 				for(var i=0;i<timeZoneArray.length;i++) 
		   		{
			 		result += timeZoneArray[i]+columnDelimiter;
			 		result += skipArray[i].toString()+lineDelimiter;
		   		} 
				fileName=fName+"_skip_STA.csv";
           		break;			
       }		
	    var element = document.createElement('a');
  		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(result));
  		element.setAttribute('download', fileName);
		element.style.display = 'none';
	    return element;
}
//========================function to export scv file=========================
function exportCSV()
{
	if(currentActionId!=3){
		var element=createCsv(currentActionId);
    	document.body.appendChild(element);
  		element.click();
  		document.body.removeChild(element);
	}
	else if(currentActionId==3)
	{
		for(i=0;i<3;i++)
		{
			var element=createCsv(i);
    		document.body.appendChild(element);
  			element.click();
  			document.body.removeChild(element);	
		}
	}
}

//===============call the draw function=======================================
function calldrawTableChart()
{
                //set the timeZoneArray
		        timeZoneStart=60;
               	timeZoneEnd=timeZoneStart+interval;
		        for(i=0;i<sectionNumber;i++)
                {
                    	timeFrameString=convertTime(timeZoneStart);
                        timeZoneArray[i]=timeFrameString;
                        timeZoneArray2[i]=convertTime(timeZoneStart);
                        timeZoneStart=timeZoneEnd;
                        timeZoneEnd=timeZoneEnd+interval;
                 }

				//draw the chart
                google.charts.load('current', {packages: ['corechart', 'bar','table']});
                google.charts.setOnLoadCallback(drawChart1);  

				//get the current action id
				currentActionId=document.getElementById("action").selectedIndex;
				currentActionName=document.getElementById("action").options[currentActionId].text;				
				//get the video file name
				if(isMulti==0){			
					fName=document.getElementById('csvFile1').value;
					fName=fName.substring(12,fName.length-4);
				}
 }





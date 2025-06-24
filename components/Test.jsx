"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import CountdownTimer from "./ui/timerClock";
import Orb from './ui/Orb'; 
import { GemniLoader } from "./ui/gemni-loader";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import dayjs from 'dayjs';
import RouteAuthCheck from "@/lib/routeAuthCheck";
import SendingAnswer from "./ui/sendingAnswer";
export default function Test() {
    const [currentQuestion, setCurrentQuestion] = useState({ audioURL: "" , text: "",questionId:"" });
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isAudioPlaying, setIsAudioPlaying] = useState(true);
    const [isAnswering, setIsAnswering] = useState(false);
    const [isLoading, setIsLoading] = useState(false); 
    const[testData,setTestData]=useState();
    const[userReady,setUserReady]=useState(false);
    const [sendingAnswer, setSendingAnswer] = useState(false);
    const [submissionId, setSubmissionId] = useState(null);
    const [answerId, setAnswerId] = useState();
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const recordedChunks = useRef([]); 
    const router = useRouter();
    const totalQuestions = testData?.numOfQuestion || 0;
    const duration = testData?.duration || 0;
    const [tabSwitchCount, setTabSwitchCount] = useState(0);
    const tabSwitchRef = useRef(0); 

    useEffect(() => {
      const handleVisibilityChange = async() => {
        if (document.visibilityState === "hidden") {
            tabSwitchRef.current += 1;
            setTabSwitchCount(tabSwitchRef.current);
            toast.warning(`Tab switch detected!`);

            if (tabSwitchRef.current >= 3) {
                toast.error("You switched tabs multiple times. Submitting test.");
                await handleNextQuestion("1"); 
            }
        }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
}, []);


    useEffect(() => {
    const handleBeforeUnload = (event) => {
      localStorage.setItem("reloaded", "true");
      event.preventDefault();       // Cancel default refresh
      event.returnValue = "";       // Chrome requires this to show the prompt
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

    useEffect(() => {
    const reloaded = localStorage.getItem("reloaded");
    if (reloaded === "true") {
      localStorage.removeItem("reloaded");
      localStorage.removeItem("testId");
      localStorage.removeItem("test");
      handleNextQuestion("1");
      setTimeout(()=>{
        router.replace("/testCluster");
      },1000) 
      }
    }, []);
    
    useEffect(() => {
      if (isAudioPlaying && currentQuestion?.audioURL) {
          const audio = new Audio(currentQuestion.audioURL);
          audio.play();
          audio.onended = () => {
              setIsAudioPlaying(false);
              setIsAnswering(true);
              startRecording(); 
          };
        }
    }, [isAudioPlaying, currentQuestion]);



    useEffect(()=>{
        const testInfo = JSON.parse(localStorage.getItem('test')); 
        setTestData(testInfo)
    },[])
    
    const handleStartInterview=()=>{
        createSubmission();
        fetchQuestion();
    }
    
       const createSubmission= async()=>{
         try {
            const formatted = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS');
            const res=await axios.post(`https://intervu-ai-beige.vercel.app/api/submission`, {
            // const res=await axios.post(`http://localhost:3000/api/submission`, {
                testId: testData._id,
                userId: localStorage.getItem("userId"),
                startedAt: formatted,
              })
            if(res.status===200)
            {
                console.log("Submission created successfully");
                console.log(res);
                setSubmissionId(res.data._id);
            }
         }catch (error) {
            toast.error("Something went wrong! try again");
          }
         }

        const fetchQuestion = async (answerId = null) => {
            const testId=testData._id;
            const {testDescription, difficulty} = testData;
            try {
                const res = await axios.post(`https://intervu-ai-beige.vercel.app/api/question/${testId}`,{
            //   const res = await axios.post(`http://localhost:3000/api/question/${testId}`,{
                  testDescription,
                  difficulty,
                  answerId
              });
              if(res.status === 200)
              {
                console.log(res);
                setCurrentQuestion({audioURL: res.data.audioURL, text: res.data.question,questionId: res.data.questionId});
                setIsAudioPlaying(true);
                setSendingAnswer(false);
                setUserReady(true);
                setIsAnswering(false);
              }
           }catch (error){
            toast.error("Error in fetching question");
            console.error("Error fetching question:", error);
           }
          };

        const sendAudioToBackend = async (ques = null) => {
            console.log("Sending audio to backend");
            console.log("currentQuestion",ques);
            const blob = new Blob(recordedChunks.current, { type: "audio/webm" });
            const formData = new FormData();
            formData.append("audio", blob, "response.webm");
            formData.append("questionId", currentQuestion._id); 
            try {
              const res=  await axios.post(`https://intervu-ai-beige.vercel.app/api/answer/${submissionId}/${currentQuestion.questionId}`,              
            //   const res=  await axios.post(`http://localhost:3000/api/answer/${submissionId}/${currentQuestion.questionId}`,
                formData,{
                    headers:{
                        "Content-Type" : "multipart/form-data",
                    }
                });
              if(res.status===200){
                const ansId=res.data.res._id;
                console.log("answerData",res);
                console.log("Audio sent successfully");
                if(ques === null) {
                    await fetchQuestion(ansId);
                }
                else{
                    submitTest();
                    return;
                }             
             } 
            }catch(err) {
                toast.error("Failed to submit answer, Retake test.");
                setTimeout(()=>{
                 router.replace("/testCluster");
                },1500)
                console.error("Failed to send audio:", err);
                return;
            }
         };

         const calcResult=async()=>{
            console.log("Calculating result");
            const res=await axios.post(`https://intervu-ai-beige.vercel.app/api/calculateResult/${submissionId}`);
            // const res=await axios.post(`http://localhost:3000/api/calculateResult/${submissionId}`);
            if(res.status===200){
                console.log("Result calculated successfully");
                console.log(res.data);
                localStorage.removeItem("testId");
                localStorage.removeItem("test");
                localStorage.removeItem("reloaded");
                setTimeout(() => {
                    router.replace("/final");
                }, 2000); 
            }

            else{
                console.error("Failed to calculate result:", res.data);
                setIsAnswering(false);
                toast.error("Failed to submit test.");
            }
         }
        const submitTest=async()=>{
            console.log("Submitting test");
              setIsAnswering(false);
              setSendingAnswer(true); 
              stopRecording();
             
         try {
            const formatted = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS');
            const res=await axios.patch(`https://intervu-ai-beige.vercel.app/api/updateSubmission`, {
            // const res=await axios.patch(`http://localhost:3000/api/updateSubmission`, {
                submissionId: submissionId, 
                userId: localStorage.getItem("userId"),
                testId: testData._id,
                completedAt: formatted,
            });
            if(res.status===200){
                console.log("Test submitted successfully");
                await calcResult();
            }
        } catch (error) {
        toast.error("Failed to submit test, please try again.");
        setIsAnswering(false);
        setSendingAnswer(false);
            console.error("Error submitting test:", error);
        }
      }
    
    useEffect(() => {
        if (isAnswering && videoRef.current) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then((stream) => {
                    streamRef.current = stream;
                    videoRef.current.srcObject = stream;  
                    startRecording(stream);
                })
                .catch((error) => {
                    console.error("Error accessing media devices: ", error);
                    toast.error("Please grant access to camera and microphone");
                });
        }    
    }, [isAnswering]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            recordedChunks.current = [];
        
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
        
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.current.push(event.data);
                }
            };
            mediaRecorder.start();
        } catch (err) {
            console.error("Microphone permission denied:", err);
        }
    };
    
    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
    };


    const handleNextQuestion = async (ques = null) => {
        setIsAnswering(false);
        setSendingAnswer(true);
        stopRecording();
        mediaRecorderRef.current.onstop = async () => {
        if (currentQuestionIndex+1 >= totalQuestions || ques === 1) 
        { 
            await sendAudioToBackend("1");
            return;
        }
        else{
            await sendAudioToBackend();
            setCurrentQuestionIndex(prev => prev + 1); 
            return;
        }
        };
    };

    return (
        <RouteAuthCheck userRole="user">
            <>
        {userReady ? ( <div className="bg-black h-screen flex flex-col items-center justify-between p-5"> 
          <h1 className="text-white text-4xl">| {testData.testName} |</h1>  
            {!isAnswering && ( sendingAnswer ? 
            (<div className="flex flex-col items-center justify-center h-full w-full gap-5">
                <SendingAnswer />
                <span className="text-2xl text-white font-semibold ">Evaluating your Answer {"(This may take time)"}</span>
            </div> ) 
            :(    
                <div className=" flex flex-col items-center justify-center h-full w-full p-5">
                    <div className="flex justify-center items-center  h-[50%] w-[50%]">
                        <Orb
                           hoverIntensity={0.3}
                           rotateOnHover={false}
                           hue={0}
                           forceHoverState={true}
                           className="w-full h-full object-contain -scale-x-100"
                         />
                    </div>
                </div>
            ))
            }

          
            {isAnswering && (
                <div className=" relative w-full h-full flex flex-col items-center justify-between">
                    <div className="absolute right-0 flex justify-between items-center w-[52%] p-2 pr-15">
                    <h2 className="center text-3xl text-white font-bold mb-4">
                        {currentQuestionIndex+1}/<span className="text-[#606dd3]">{totalQuestions}</span>
                    </h2>
                        <CountdownTimer handleNextQuestion={handleNextQuestion} initialMinutes={duration} initialSeconds={0} /> 
                    </div>
                   <div className="w-full h-full flex flex-col items-center justify-between mt-24">
                    <p className="text-white text-xl text-center w-[60%] font-normal select-none">
                        {/* Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ullam modi sunt beatae doloribus tenetur cumque libero cum blanditiis, eos sit totam explicabo iure qui nulla a ducimus mollitia sequi. Culpa? */}
                        {currentQuestion.text}
                    </p>
                    <div className="flex justify-center items-center h-[50%] w-[25%]">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full border-2 border-white-300 rounded-3xl overflow-hidden -scale-x-100"
                    />
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1">
                        <div className="h-6 w-64 flex items-center justify-center gap-0.5">
                        {[...Array(48)].map((_, i) => (
                            <div
                              key={i}
                              className=
                                "w-0.5 rounded-full transition-all duration-700 bg-white/50 animate-pulse"                           
                              style={
                                {
                                      height: `${20 + Math.random() * 80}%`,
                                      animationDelay: `${i * 0.05}s`,
                                    }
                              }
                            />
                          ))}
                        </div>
                          <p className="h-4 text-lg text-white/70 ">
                          Listening...
                        </p>
                        </div>
                    <div className="flex justify-between items-center w-[28%] p-5">
                           <Button
                            onClick={()=>handleNextQuestion("1")}
                            className=" h-full bg-[#606dd3] text-white rounded w-[30%] hover:bg-[#5862b2]"
                        >
                            Finish Test
                        </Button>
                        <Button
                            onClick={handleNextQuestion}
                            className=" h-full bg-[#606dd3] group text-white w-[30%] rounded hover:bg-[#5862b2]"
                        >   Save & Next
                            <ArrowRight
                              className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5"
                              size={16}
                              strokeWidth={2}
                              aria-hidden="true"
                            />
                        </Button>
                    </div>
                   </div>
                 
                </div>
              )}
          </div>) 
          :(<GemniLoader handleStartInterview={handleStartInterview} />)}
          <Toaster richColors position="top-center" />
        </>
       </RouteAuthCheck>
    );
}

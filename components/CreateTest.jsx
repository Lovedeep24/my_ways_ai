"use client"
import React from 'react'
import { useState, useEffect} from "react"
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Iinput } from "@/components/ui/number-input"
import { Input } from "@/components/ui/input";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from 'axios';
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTags } from "@/components/hooks/use-tags";
import { Button } from "@/components/ui/button";
import { AnimatedSubscribeButton } from "@/components/magicui/animated-subscribe-button";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Description } from '@radix-ui/react-dialog';

export default function CreateTest() {

const handleCreateTest= async(testInfo,marks,difficulty)=>{
  try {
    const response = await axios.post("http://localhost:3000/api/admin/addTest",{
      testName: testInfo.testName,
      testDescription: testInfo.description,
      difficulty:difficulty,
      numOfQuestion:testInfo.noOfQuestion,
      duraton:testInfo.duration,
      accuracy: marks.accuracyMark,
      completeness:marks.completenessMark,
      explanation:marks.explainationMark,
      practicalRelevance: marks.practicalRelevanceMark,
      conciseness: marks.concisenessMark,
      score:marks.totalMark,
      keyWords:tag
  })
  if(response.status === 200)
  {
      toast.success("Test Created Successfullt");
      return
  }
  } catch (error) {
    toast.error("Something went wrong! Try again")
    console.log(error);
    return
  }
 
} 


const [difficulty,setDifficulty]=useState();
const [testInfo,setTestInfo]=useState({
  testName: '',
  description:'',
  noOfQuestions: 0,
  duration: 0,
})
const [marks, setMarks] = useState({
  totalMark: 0,
  accuracyMark: 0,
  practicalRelevanceMark: 0,
  completenessMark: 0,
  concisenessMark: 0,
  explainationMark: 0,
});

const handleTestInfoChange = (key,value)=>{
  setTestInfo((prevInfo)=>({
    ...prevInfo,
    [key]:value,
  }));
}

const handleMarksChange = (key, value) => {
  setMarks((prevMarks) => ({
    ...prevMarks,
    [key]: value,
  }));
};

const max = 10;
const skipInterval = 2;
const ticks = [...Array(max + 1)].map((_, i) => i);
const DEMO_SUGGESTIONS = [
  { id: "next", label: "Next.js" },
  { id: "react", label: "React" },
  { id: "tailwind", label: "Tailwind" },
  { id: "typescript", label: "TypeScript" },
  { id: "ui", label: "UI" },
];

const [inputValue, setInputValue] = useState("");
const [tag,setTags]=useState([]);
const { tags, addTag, removeTag, removeLastTag, hasReachedMax  } = useTags({
  maxTags: 5,
  onChange: (tags) =>{ 
  // console.log("Tags updated:", tags);
  const extractedTagNames = tags.map((tag) => tag.label);
  setTags(extractedTagNames);
  }
});
// console.log(tag);

const handleKeyDown = (e) => {
  if (e.key === "Backspace" && !inputValue) {
    e.preventDefault();
    removeLastTag();
  }
    if (e.key === "Enter" && inputValue) {
      e.preventDefault();
      addTag({ id: inputValue.toLowerCase(), label: inputValue });
      setInputValue("");
    }
  };

  useEffect(() => { 
    const total=marks.accuracyMark + marks.completenessMark + marks.explainationMark + marks.practicalRelevanceMark + marks.concisenessMark;
    handleMarksChange("totalMark",total);
  }, 
  [marks.accuracyMark, marks.completenessMark, marks.explainationMark, marks.practicalRelevanceMark, marks.concisenessMark])

// console.log(inputValue);
  return (
    <div className="flex-grow h-scree ">
      <div className='flex items-center justify-between p-4 w-full h-10 mt-2'>
        <h1 className='text-2xl font-bold'>Admin Portal</h1>
     <img
            // src="/appLogo3.png" 
            alt="Logo"
            className="h-14 w-auto overflow-hidden"
          /> 
     </div>
     <div className='flex w-full mt-2 p-4 h-auto'>
            <Toaster richColors position="top-center" />
      <div className='flex flex-col justify-center gap-5 items-center w-[35%] '>
      <Label className="text-2xl">Marks Breakup</Label>
          <div className='flex flex-col w-[90%] items-center justify-center gap-5 '>

            <div className="w-[90%]  gap-4 flex justify-center items-center p-3 border-b-2"> 
              <div className='flex flex-col w-full '>
                 <Label className="text-xl">Accuracy</Label>
                   <Slider className="mt-7"  defaultValue={[0]} max={max}  onValueChange={(value)=> handleMarksChange("accuracyMark", value[0])} aria-label="Slider with ticks" />
                   <span
                     className="mt-3 flex w-full items-center justify-between gap-1 px-2.5 text-xs font-medium text-muted-foreground"
                     aria-hidden="true"
                   >
                     {ticks.map((_, i) => (
                       <span key={i} className="flex w-0 flex-col items-center justify-center gap-2">
                         <span
                           className={cn("h-1 w-px bg-muted-foreground/70", i % skipInterval !== 0 && "h-0.5")}
                         />
                         <span className={cn(i % skipInterval !== 0 && "opacity-0")}>{i}</span>
                       </span>
                     ))}
                   </span>
                 </div>
                 <Iinput value={marks.accuracyMark} min={0} max={10} />
               </div>

               <div className="justify-center items-center w-[90%] gap-4 flex p-3 border-b-2">
                 <div className='flex flex-col w-full '>
                 <Label className="text-xl">Completeness</Label>
                   <Slider className="mt-7" defaultValue={[0]} max={max}  onValueChange={(value)=> handleMarksChange("completenessMark", value[0])}  aria-label="Slider with ticks" />
                   <span
                     className="mt-3 flex w-full items-center justify-between gap-1 px-2.5 text-xs font-medium text-muted-foreground"
                     aria-hidden="true"
                   >
                     {ticks.map((_, i) => (
                       <span key={i} className="flex w-0 flex-col items-center justify-center gap-2">
                         <span
                           className={cn("h-1 w-px bg-muted-foreground/70", i % skipInterval !== 0 && "h-0.5")}
                         />
                         <span className={cn(i % skipInterval !== 0 && "opacity-0")}>{i}</span>
                       </span>
                     ))}
                   </span>
                 </div>
                 <Iinput className="w-auto" value={marks.completenessMark} min={0} max={10} />
               </div>

               <div className="justify-center items-center w-[90%] gap-4 flex p-3 border-b-2">
               <div className='flex flex-col w-full'>
                 <Label className="text-xl">Explaination</Label>
                   <Slider className="mt-7" defaultValue={[0]} max={max}  onValueChange={(value)=> handleMarksChange("explainationMark", value[0])}  aria-label="Slider with ticks" />
                   <span
                     className="mt-3 flex w-full items-center justify-between gap-1 px-2.5 text-xs font-medium text-muted-foreground"
                     aria-hidden="true"
                   >
                     {ticks.map((_, i) => (
                       <span key={i} className="flex w-0 flex-col items-center justify-center gap-2">
                         <span
                           className={cn("h-1 w-px bg-muted-foreground/70", i % skipInterval !== 0 && "h-0.5")}
                         />
                         <span className={cn(i % skipInterval !== 0 && "opacity-0")}>{i}</span>
                       </span>
                     ))}
                   </span>
                 </div>
                 <Iinput className="w-auto" value={marks.explainationMark} min={0} max={10} />
               </div>

               <div className="justify-center items-center w-[90%] gap-4 flex p-3 border-b-2">
               <div className='flex flex-col w-full'>
                 <Label className="text-xl">Conciseness</Label>
                   <Slider className="mt-7"  defaultValue={[0]} max={max}  onValueChange={(value)=> handleMarksChange("concisenessMark", value[0])}  aria-label="Slider with ticks" />
                   <span
                     className="mt-3 flex w-full items-center justify-between gap-1 px-2.5 text-xs font-medium text-muted-foreground"
                     aria-hidden="true"
                   >
                     {ticks.map((_, i) => (
                       <span key={i} className="flex w-0 flex-col items-center justify-center gap-2">
                         <span
                           className={cn("h-1 w-px bg-muted-foreground/70", i % skipInterval !== 0 && "h-0.5")}
                         />
                         <span className={cn(i % skipInterval !== 0 && "opacity-0")}>{i}</span>
                       </span>
                     ))}
                   </span>
                 </div>
                 <Iinput value={marks.concisenessMark} min={0} max={10} />
               </div>


               <div className="justify-center items-center w-[90%] gap-4 flex p-3 border-b-2">
               <div className='flex flex-col w-full'>
                 <Label className="text-xl">Practical Relevance</Label>
                   <Slider className="mt-7"  defaultValue={[0]} max={max}  onValueChange={(value)=> handleMarksChange("practicalRelevanceMark", value[0])} aria-label="Slider with ticks" />
                   <span
                     className="mt-3 flex w-full items-center justify-between gap-1 px-2.5 text-xs font-medium text-muted-foreground"
                     aria-hidden="true"
                   >
                     {ticks.map((_, i) => (
                       <span key={i} className="flex w-0 flex-col items-center justify-center gap-2">
                         <span
                           className={cn("h-1 w-px bg-muted-foreground/70", i % skipInterval !== 0 && "h-0.5")}
                         />
                         <span className={cn(i % skipInterval !== 0 && "opacity-0")}>{i}</span>
                       </span>
                     ))}
                   </span>
                 </div>
                 <Iinput value={marks.practicalRelevanceMark} min={0} max={10} />
               </div>


            </div>

            <div className='flex w-[90%] items-center justify-center gap-5'>
            <h1 className='flex justify-center items-center text-3xl w-[50%] p-2  rounded-xl '>Total Marks</h1>
            <div className=" space-y-2 border- flex flex-col items-center justify-center">
              <NumberTicker
                value={marks.totalMark}
                className="whitespace-pre-wrap text-5xl font-medium  w-[6rem] flex items-center justify-center rounded-xl tracking-tighter "
              />
            </div>
            </div>
      </div>
  {/* -------------------------------------------R I G H T   H A L F-------------------------------------------------------------------     */}
      <div className=' gap-5 flex flex-col border-l-2 items-center  w-[65%]'>
          <div className='w-full flex  flex-col justify-center items-center gap-5'>
                <div className="group relative w-[55%] ">
                    <label
                        htmlFor="testName"
                      className="origin-start absolute top-1/2 block -translate-y-1/2 cursor-text p-3 text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground">
                      <span className="inline-flex bg-background px-2">Test Name</span>
                    </label>
                    <Input id="testName"  type="email" placeholder="" onChange={(e)=>handleTestInfoChange("testName",(e.target.value))} />
                </div>
             <div className='flex gap-5 w-[55%]'>
                <div className="group relative  ">
                    <label
                     htmlFor="Duration"
                      className="origin-start absolute top-1/2 block -translate-y-1/2 cursor-text p-3 text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground">
                      <span className="inline-flex bg-background px-2">Test Duration(min)</span>
                    </label>
                    <Input id="Duration" type="number" onChange={(e)=>handleTestInfoChange("duration" ,(e.target.value))} placeholder="" />
                </div>
                <div className="group relative w-[70%] ">
                    <label
                     htmlFor="Questions"
                      className="origin-start absolute top-1/2 block -translate-y-1/2 cursor-text p-3 text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground">
                      <span className="inline-flex bg-background px-2">No of Questions</span>
                    </label>
                    <Input id="Questions" type="number" onChange={(e)=> handleTestInfoChange("noOfQuestions",(e.target.value))} placeholder="" />
                </div>
              </div>
              <div className="justify-center items-center w-[50%] gap-4 flex p-3">
                <div className="flex flex-col w-full">
                  <Label className="text-xl">Difficulty</Label>
                  <Slider
                    className="mt-7"
                    defaultValue={[0]}
                    max={2}
                    step={1}
                    aria-label="Difficulty Selector"
                    onValueChange={(value) =>{setDifficulty(["Easy", "Medium", "Hard"][value[0]])}}
                  />
                  <div className="mt-3 flex w-full items-center justify-between px-2.5 text-xs font-medium">
                    {["Easy", "Medium", "Hard"].map((label, i) => {
                      const colors = ["bg-green-300 text-green-900", "bg-orange-300 text-orange-900", "bg-red-300 text-red-900"];
                      return (
                        <span key={i} className={`flex flex-col w-15 rounded-xl p-2 items-center ${colors[i]}`}>
                          <span>{label}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
        <div className=" w-[70%] h-[30%]">
          <Label htmlFor="textArea" className="text-xl">Test Description</Label>
          <Textarea
            id="textArea"
            onValueChange ={(e)=>{handleTestInfoChange("description",(e.target.value))}}
            className="border-destructive/80 h-[70%] mt-2 text-md text-destructive text-black focus-visible:border-destructive/80 focus-visible:ring-destructive/20"
            placeholder="Enter Detailed description of test"
            defaultValue=""
          />
          <p className="pt-2 text-md text-destructive" role="alert" aria-live="polite">
            Test details should be at least 30 characters
          </p>
      </div>

      <div className="  w-[100%] flex flex-col justify-center items-center space-y-4">
      <div className="space-y-2 flex w-[100%] items-center justify-center gap-5">
        <label className="font-medium text-xl">Tags</label>
        <div className="rounded-lg border w-[55%] border-input bg-background p-1 ">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className={cn(
                  "inline-flex  items-center gap-1 rounded-md px-2 py-1 text-sm",
                  tag.color || "bg-primary/10 text-primary"
                )}
              >
                {tag.label}
                <button
                  onClick={() => removeTag(tag.id)}
                  className="rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={hasReachedMax ? "Max tags reached" : "Add tag..."}
              disabled={hasReachedMax}
              className="flex-1  bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>
      
      <div className=" flex flex-col w-[50%] space-y-2">
        <label className="text-sm font-medium">Suggestions</label>
        <div className="flex flex-wrap gap-2">
          {DEMO_SUGGESTIONS.map((suggestion) => (
            <Button
              key={suggestion.id}
              variant="outline"
              size="sm"
              onClick={() => {
                if (!tags.find(t => t.id === suggestion.id)) {
                  addTag(suggestion);
                }
              }}
              disabled={hasReachedMax || tags.find(t => t.id === suggestion.id)}
            >
              {suggestion.label}
            </Button>
          ))}
        </div>
      </div>
    </div>

    <div className='buttons w-[55%] p-5 flex justify-between items-center gap-5'>
    <AnimatedSubscribeButton onClick={()=>{handleCreateTest(testInfo,marks,difficulty)} } className="w-fit-content">
      <span className="group inline-flex items-center">
        Create Test
        <ChevronRightIcon className="ml-1 size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
      <span className="group inline-flex items-center">
        <CheckIcon className="mr-2 size-4" />
        Test Created
      </span>
    </AnimatedSubscribeButton>

    <AnimatedSubscribeButton disabled className="w-fit-content">
      <span className="group inline-flex items-center">
        Publish Test
        <ChevronRightIcon className="ml-1 size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
      <span className="group inline-flex items-center">
        <CheckIcon className="mr-2 size-4" />
        Test Published
      </span>
    </AnimatedSubscribeButton>
    </div>
      </div>
     </div>
    </div>
  )
}

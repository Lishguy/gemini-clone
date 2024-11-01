import { createContext, useState } from "react";
import run from "../config/genini";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);

    const delayPara = (index, nextWord) => {
        setTimeout(function() {
            setResultData(prev=>prev+nextWord)
        },75*index)
    }

    const newChat = () => {
        setLoading(false)
        setShowResult(false)
    }


    const onSent = async (prompt) => {

        setResultData("")
        setLoading(true)
        setShowResult(true)
        
        let newResponse;
        if(prompt !== undefined){
            newResponse = await run(prompt);
            setRecentPrompt(prompt)
        } else{
            setPrevPrompts(prev=>[...prev, input])
            setRecentPrompt(input)
            newResponse = await run(input)
        }
       
        
        try {
            // const newResponse = await run(input);
            setResultData(newResponse || "No response received.");
    
            // Escape HTML-like syntax
            let escapedResponse = newResponse
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
    
            // Handle bold formatting and line breaks
            let formattedResponse = escapedResponse
                .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Replace **text** with <b>text</b>
                .replace(/\*(.*?)\*/g, '<br />$1<br />') // Replace *text* with <br />text<br />
                .replace(/^## (.*)$/gm, '<b>$1</b>'); // Replace lines starting with ## with <b>text</b>
    
            // Replace new lines in the input text with <br /> as well
            formattedResponse = formattedResponse.replace(/\n/g, '<br />'); // Ensure new lines are converted to <br />
    
            // Set the final formatted response
            setResultData(formattedResponse);
        } catch (error) {
            console.error(error);
            setResultData("An error occurred while fetching data.");
        } finally {
            setLoading(false);
            setInput("");
        }
    };




    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider
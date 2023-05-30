import React, { useEffect, useState } from 'react'
import data from './data4.json';
import './questions.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const QuestionDemo = () => {
    const [currentQuestion, setCurrentQuestion] = useState("101");
    const [nextQ, setNextQ] = useState("101");
    const [selectedOption, setSelectedOption] = useState(null);
    const [previousQuestions, setPreviousQuestions] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [answers, setAnswers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [nextQuestionString, setNextQuestionString] = useState("");
    const [copySuccess, setCopySuccess] = useState(false);

    // Filter questions based on current question
    const filteredQuestions = data.questions.filter(item => item["Spurning #"] === currentQuestion);
    const filteredNextQuestion = data.questions.filter(item => item["Spurning #"] === nextQ);

    const isQuestionValid = filteredQuestions.length > 0;
    const isNextQuestionValid = filteredNextQuestion.length > 0;

    // Function to handle response selection
    const handleSelect = (nextQuestion, index) => {
        //if (nextQuestion !== "#") {
        setSearchTerm("");
        setNextQ(nextQuestion);
        // }
        setAnswers([...answers, filteredQuestions[index]]);
        setSelectedOption(index);
    }

    const copyToClipboard = (index) => {
        // text that you want to copy
        let textToCopy = filteredNextQuestion.length > index ? filteredNextQuestion[index]["Spurning með valmöguleika"] : "";
        navigator.clipboard.writeText(textToCopy).then(function () {
            setCopySuccess(index);
        }, function (err) {
            console.error('Async: Could not copy text: ', err);
        });
    };

    const copyAllQuestions = () => {
        // text that you want to copy
        let textToCopy = "";
        filteredNextQuestion.forEach((item) => {
            textToCopy += item["Spurning með valmöguleika"] + "\n";
        });

        navigator.clipboard.writeText(textToCopy).then(function () {
            setCopySuccess(true);
        }, function (err) {
            console.error('Async: Could not copy text: ', err);
        });
    };




    const handleNext = () => {
        console.log(nextQ);
        if (nextQ !== "#") {
            setPreviousQuestions(prevQuestions => [...prevQuestions, currentQuestion]);
            setCurrentQuestion(nextQ);
        } else {
            setShowResults(true);
        }
        setSelectedOption(null);
    }

    const handleBack = () => {
        if (previousQuestions.length > 0) {
            setCurrentQuestion(previousQuestions[previousQuestions.length - 1]);
            setPreviousQuestions(prevQuestions => prevQuestions.slice(0, prevQuestions.length - 1));
            setAnswers(answers.slice(0, answers.length - 1));
        }
    }

    useEffect(() => {
        console.log(selectedOption);
    }, [selectedOption])

    const parseBoldText = (content) => {
        return { __html: content };
    }

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        setCurrentQuestion(searchTerm);
        setSelectedOption(null);
        setCopySuccess(false);
    };

    return (
        <div>
            {!showResults ? (
                <>
                    <div className='search__icon'
                    onClick={handleFormSubmit}
                    >
                        <FontAwesomeIcon icon={faSearch} />
                    </div>

                    <div>
                        <form onSubmit={handleFormSubmit}>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleInputChange}
                                placeholder="Spurninganúmer"
                                className='input__question'
                            ></input>
                        </form>
                    </div>




                    <div className="question__back">
                        {previousQuestions && (
                            <div onClick={handleBack}>
                                &lt; Til Baka
                            </div>
                        )}
                    </div>
                    {isQuestionValid ? (
                        <>
                            <div>
                                <div>
                                    {filteredQuestions[0]["Þáttur "]}
                                    {filteredQuestions[0]["Spurning #"]}
                                </div>
                                {filteredQuestions.map((item, index) => (
                                    <div key={index}>

                                        <div className="option__bar">
                                            <button
                                                className={selectedOption === index ? 'button__selected' : ''}
                                                onClick={() => handleSelect(item["Næsta spurning. "], index)}
                                            >

                                                <div className='option__inside'>

                                                </div>

                                            </button>
                                            <p
                                                className='option__question'
                                                dangerouslySetInnerHTML={parseBoldText(item["Spurning með valmöguleika"].slice(3))}>
                                            </p>

                                        </div>

                                    </div>
                                ))}
                            </div>
                        </>) : (
                        <div>Engin spurning númer  {currentQuestion}</div>

                    )}

                    {selectedOption !== null && (
                        <div>
                            <h1>Næsta Spurning</h1>

                            <button className='copy__button' onClick={() => copyAllQuestions()}>
                                {copySuccess ? <span>Text copied!</span> : "Copya allt"}
                            </button>

                            {filteredNextQuestion && filteredNextQuestion.length > 0 ? (
                                <>
                                    <div>
                                        {filteredNextQuestion[0]["Spurning #"]}
                                    </div>

                                    {filteredNextQuestion.map((item, index) => (
                                        <div key={index}>
                                            <p
                                                className='option__question'
                                                dangerouslySetInnerHTML={parseBoldText(item["Spurning með valmöguleika"].slice(3))}
                                            ></p>

                                            <div>
                                                <button className='copy__button' onClick={() => copyToClipboard(index)}>
                                                    {copySuccess === index ? <span>Text copied!</span> : "Copy"}
                                                </button>


                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <p>Spurningaleið endar hér.</p>
                            )}


                        </div>
                    )}



                    < div className="question__buttonprim"
                        onClick={() => { handleNext() }}>
                        Næsta
                    </div>

                    <div className='extra__space'>

                    </div>
                </>
            ) : (
                <div>
                    <h2>Niðurstöður</h2>
                    {answers.map((answer, index) => (
                        <div key={index}>

                            <p className='options__questiontitle'>{answer["Spurning #"]}</p>
                            <p
                                className='option__question'
                                dangerouslySetInnerHTML={parseBoldText(answer["Spurning með valmöguleika"].slice(3))}>
                            </p>
                        </div>
                    ))}
                </div>
            )
            }
        </div >
    );
}

export default QuestionDemo

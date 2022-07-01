import React, {useState, useEffect} from 'react'
import './style.css';
import Question from './Components/Question'
import { nanoid } from 'nanoid'


function App() {

	const [pageState, setPageState] = useState(0)
	const [questions, setQuestions] = useState([])
	const [clickState, setClickState] = useState(["", "", "", "", ""])
	const [score, setScore] = useState(0)
	const [attemptNext, setAttemptNext] = useState(false)
	const [errorShake, setErrorShake] = useState(false)
	const [gameOver, setGameOver] = useState(false)
	const [reset, setReset] = useState(true)

	function clickHandler() {
		setPageState(prev => prev + 1)
	}

    function getRandom(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); 
    }

    function shuffle(arr) {
        for (let i = 0; i < arr.length; i++) {
            let idx = getRandom(i, arr.length)
            let temp = arr[idx]
            arr[idx] = arr[i]
            arr[i] = temp
        }
        return arr
    }

	useEffect(() => {
		fetch("https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple").then(
			res => res.json()
		).then(
			data => {
				data.results.map(questionObject => {
					setQuestions(prev => {
						return [...prev, 
							{
								question: questionObject.question, 
								answers: shuffle([...questionObject.incorrect_answers, questionObject.correct_answer].map(answer => {
									return {value: answer, id: nanoid()}
								})),
								correct: questionObject.correct_answer,
								id: nanoid(),
							}]
					})
				})
			}
		)
	}, [reset])

	function handleAnswerClick(val, index) {
		setClickState(prev => prev.map((prevVal, idx) => {
			return idx === index ? val : prevVal
		}))
	}

	const questionElements = questions.map((question, index) => {
		return (
			<Question 
				key={question.id} 
				id={question.id}
				question={question.question} 
				answers={question.answers}
				questionNumber={index}
				answerClick={handleAnswerClick}
				clicked={clickState[index]}
				attempted={attemptNext}
				gameOver={gameOver}
				correct={question.correct}
			/>
		)
	})

	useEffect(() => {
		let count = 0;
		for (let i = 0; i < clickState.length; i++) {
			if (questions[0] && clickState[i] === questions[i].correct) {
				count++;
			}
		}
		setScore(count)
	}, [clickState])

	function handleCheck() {
		if (clickState.every(click => click !== "")) {
			setGameOver(true)
		} else {
			setAttemptNext(true)
			setErrorShake(true)
			setTimeout(() => setErrorShake(false), 1000)
		}
	}

	function playAgain() {
		setPageState(0)
		setQuestions([])
		setClickState(["", "", "", "", ""])
		setScore(0)
		setAttemptNext(false)
		setErrorShake(false)
		setGameOver(false)
		setReset(prev => !prev)
	}

	return (
		<main className={pageState > 0 ? "small-blobs" : "normal-blobs"}>
			{pageState === 0 && <div className="title-page">
				<h1 className="title">
					Quizzical
				</h1>
				<p className="description">
					Test your skills with this quick five-question trivia quiz.
				</p>
				<button className="play-button" onClick={clickHandler}>
					Start quiz
				</button>
			</div>}

			{pageState === 1 && <div className="question-body">
				{questionElements}
				{gameOver ?
					<div className="result">
						<h3 className="congrats">You scored {score}/5 correct answers!</h3>
						<button className="play-again" onClick={playAgain}>Play again</button>
					</div>
				:
					<button className={`next-button ${errorShake ? "error-button" : ''}`} onClick={handleCheck}>
						Check answers
					</button>
				}
			</div>}
		</main>
	);
}

export default App;

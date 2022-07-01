import React from 'react'
import {decode} from 'html-entities';

function Question(props) {

    const answerElements = props.answers.map((answer) => {
        return (
            <button 
                key={answer.id} 
                id={answer.id}
                className={`answer-button ${props.clicked === answer.value ? 'clicked-button' : 'unclicked-button'}
                ${props.gameOver ? 'answer-game-over' : ''} ${answer.value === props.correct ? 'correct': 'wrong'}`}
                onClick={() => props.answerClick(answer.value, props.questionNumber)}
            >
                {decode(answer.value)}
            </button>
        )
    })

    return (
        <div className="question-block">
            <h2 className={`question ${props.attempted && props.clicked === "" ? "unanswered" : ""}`}>
                <span>{decode(props.question)}</span>
            </h2>
            <div className="answer-list">
                {answerElements}
            </div>
            <hr className="divider" />
        </div>
    )
}

export default Question
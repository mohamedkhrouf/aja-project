// src/components/QuestionForm.js

import React, { useState, useEffect } from "react";
import axios from "axios";

const QuestionForm = () => {
  const [formData, setFormData] = useState({
    text: "",
    condition_field: "",
    options: false,
    answers: [{ answer: "", nextQuestionId: "" }],
  });
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Fetch questions when the component mounts
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/questions");
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAnswerChange = (index, e) => {
    const { name, value } = e.target;
    const newAnswers = formData.answers.map((answer, i) =>
      i === index ? { ...answer, [name]: value } : answer,
    );
    setFormData({
      ...formData,
      answers: newAnswers,
    });
  };

  const addAnswer = () => {
    setFormData({
      ...formData,
      answers: [...formData.answers, { answer: "", nextQuestionId: "" }],
    });
  };

  const removeAnswer = (index) => {
    setFormData({
      ...formData,
      answers: formData.answers.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/questions",
        formData,
      );
      console.log("Question added successfully:", response.data);
      // Optionally, reset form or show success message
    } catch (error) {
      console.error("Error adding question:", error);
      // Optionally, show error message
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <div className="mb-3">
        <label htmlFor="text" className="form-label">
          Question Text
        </label>
        <input
          type="text"
          className="form-control"
          id="text"
          name="text"
          value={formData.text}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="condition_field" className="form-label">
          Condition Field
        </label>
        <input
          type="text"
          className="form-control"
          id="condition_field"
          name="condition_field"
          value={formData.condition_field}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="options"
          name="options"
          checked={formData.options}
          onChange={handleInputChange}
        />
        <label className="form-check-label" htmlFor="options">
          Options
        </label>
      </div>
      <div className="mb-3">
        <label className="form-label">Answers</label>
        {formData.answers.map((answer, index) => (
          <div key={index} className="mb-2">
            <input
              type="text"
              className="form-control mb-1"
              placeholder="Answer"
              name="answer"
              value={answer.answer}
              onChange={(e) => handleAnswerChange(index, e)}
              required
            />
            <select
              className="form-control mb-1"
              name="nextQuestionId"
              value={answer.nextQuestionId}
              onChange={(e) => handleAnswerChange(index, e)}
            >
              <option value="">Select Next Question</option>
              {questions.map((question) => (
                <option key={question._id} value={question._id}>
                  {question.text}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => removeAnswer(index)}
            >
              Remove Answer
            </button>
          </div>
        ))}
        <button type="button" className="btn btn-primary" onClick={addAnswer}>
          Add Answer
        </button>
      </div>
      <button type="submit" className="btn btn-success">
        Submit
      </button>
    </form>
  );
};

export default QuestionForm;
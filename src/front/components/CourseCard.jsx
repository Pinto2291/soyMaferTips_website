import React from "react";

export const CourseCard = ({ course, onSelectCourse }) => {
  const handleMoreInfo = () => {
    if (onSelectCourse) {
      onSelectCourse(course.title);
    }
  };

  return (
    <div className="course-item glow-hover">
      <img 
        src={course.image_url || "/img/auto-maquillaje.JPG"} 
        alt={course.title} 
        className="course-img" 
      />
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <a href="#contact" onClick={handleMoreInfo} className="btn btn-secondary">
        {course.button_text || "Más Información"}
      </a>
    </div>
  );
};

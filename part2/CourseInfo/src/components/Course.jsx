const Course = ({course}) => {
    return (
      <div>
        <Header course={course.name} />
        <Content parts={course.parts}/>
        <Total parts={course.parts} />
      </div>
  
    )
  }
  
  const Header = (props) => {
    return (
      <h1>{props.course}</h1>
    )
  }
  
  const Part = (props) =>
  {
    return (
      <p>{props.partName} {props.numExercises}</p>
    )
  }
  
  const Content = (props) =>
  {
    return (
      <>
      {props.parts.map(part => 
      <Part key={part.id} partName={part.name} numExercises={part.exercises} />
      )}
      </>
    )
  }
  
  const Total = (props) =>
  {
    return (
      <p>Number of exercises {props.parts.reduce((prev, curr) => prev + curr.exercises, 0)}</p>
    )
  }

  export default Course
import {useState, useRef, useEffect} from 'react';
import { api } from '../../App';

function CoursesSearchPopup({
  courses, 
  setCourses,
  courseIds,
  setCourseIds
}) {
  
  const [coursesData, setCoursesData] = useState([]);
  const searchRef = useRef();

  async function handleSearchCourses() {
    try {
      const response = await api.get(`learning_tracker/apis/materials/?search=${searchRef.current.value}`);

      if (response.status === 200) {
        const data = await response.data;

        setCoursesData(data);
      }

    } catch (error) {
      console.error(error0)
    }
  }

  useEffect(() => {
    console.log(courses)
    console.log(courseIds)
  }, [courses])

  return (
    <div className='courses-popup'>
      <div className="search-done">
        <input ref={searchRef} onChange={handleSearchCourses} type="text" placeholder='Search courses' />
        <button>done</button>
      </div>
      <div className='course-results'>
        {coursesData.map(course => {
          return (
            <div onClick={(e) => {
              var index = courseIds.indexOf(course['id']);
              
              if (index === -1) {
                courses.push(course);
                courseIds.push(course['id'])
                setCourses(courses);
                setCourseIds(courseIds)
              }
              else {
                courses.splice(index, 1);
                courseIds.splice(index, 1);
                setCourses(courses);
                setCourseIds(courseIds);
              }
              
              if ((e.target.tagName === 'DIV' && e.target.classList[-1] === 'image') || (e.target.tagName === 'H3')) {
                e.target.parentElement.classList.toggle('chosen');
              } else if (e.target.tagName === 'IMG') {
                e.target.parentElement.parentElement.classList.toggle('chosen');
              } else {
                e.target.classList.toggle('chosen');
              }

            }} className={courseIds.indexOf(course['id']) !== -1 ? 'chosen' : ''}>
                <div className="image">
                  <img src={course['image']} />
                </div>
                <h3>{course['name'].length > 20 ? course['name'].slice(0, 22) + '...' : course['name']}</h3>
            </div>
          )
        })}

      </div> 
    </div>
  )
}

export default CoursesSearchPopup
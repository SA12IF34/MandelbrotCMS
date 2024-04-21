import React, {useRef, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

function AddProject({api}) {

  const nameRef = useRef();
  const descriptionRef = useRef();
  const [partitions, setPartitions] = useState([]);

  const startRef = useRef();
  const finishRef = useRef();

  const navigate = useNavigate();

  async function addProject(data) {
    try {
      const response = await api.post('projects/', data)
      
      if (response.status === 201) {
        const data = await response.data;
        navigate(`/sessions_manager/projects/${data['id']}/`);
      }
    } catch (error) {
      console.log(data)
    }
  }

  function removePartition(e) {
    e.target.parentElement.remove();
  }

  function addPartition(parent, partitionName, partitionDescription) {

    let partition = document.createElement('div');
    partition.classList.add('partition');

    let name = document.createElement('h3');
    name.textContent = partitionName;
    let br = document.createElement('br');
    let description = document.createElement('p')
    description.textContent = partitionDescription;
    let btn = document.createElement('button');
    btn.classList.add('remove-btn');
    btn.onclick = removePartition;
    btn.textContent = 'x';
    
    partition.append(name, br, description, btn);

    parent.appendChild(partition);
  }

  function createPartition(e) {
    let parent = e.target.parentElement.parentElement.lastElementChild;

    let container = document.createElement('div');
    let nameInput = document.createElement('input');
    let descriptionInput = document.createElement('textarea');

    let addBtn = document.createElement('button');
    let cancelBtn = document.createElement('button');
    let btnContainer = document.createElement('div');

    nameInput.placeholder = 'Partition Name';
    descriptionInput.placeholder = 'Partition Description..';

    addBtn.textContent = 'add';
    cancelBtn.textContent = 'cancel';

    container.classList.add('partition-form');
    nameInput.classList.add('name-input');
    descriptionInput.classList.add('description-input');

    addBtn.classList.add('partition-add');
    cancelBtn.classList.add('partition-cancel');
    btnContainer.classList.add('btn-container');

    btnContainer.append(addBtn, cancelBtn);

    container.append(nameInput, descriptionInput, btnContainer);
    parent.appendChild(container);

    cancelBtn.onclick = () => {
      container.remove()
    }

    addBtn.onclick = () => {
      if (nameInput.value === '' || descriptionInput.value === '') {
        alert("please fill all inputs in order to create new partition");
      } else {
        let name = nameInput.value;
        let description = descriptionInput.value;
        container.remove();

        addPartition(parent, name, description);
      }
    }

  }

  function captureData() {
    const data = {
      project: {
        name: nameRef.current.value,
        description: descriptionRef.current.value
      },
      partitions: []
    }
   
    if (startRef.current.value) {
      data['project']['starting_time'] = startRef.current.value;
    }
    if (finishRef.current.value) {
      data['project']['finish_time'] = finishRef.current.value;
    }


    if (nameRef.current.value === '' || descriptionRef.current.value === '') {
      alert('Please fill all required fields');
      return -1;
    }


    let partitionElements = document.querySelectorAll('.partition');
    
    if (partitionElements.length === 0) {
      alert("You must have at least One Partition.");
      return -1;
    }

    const partitions = []

    partitionElements.forEach((p) => {
      
      partitions.push({
        name: p.querySelector('h3').textContent,
        description: p.querySelector('p').textContent
      })
    })

    data['partitions'] = partitions

    return data;
  }

  function handleAdd() {
    const data = captureData();
    if (data === -1){
      return;
    }
    addProject(data);
  }

  return (
    <div className='new-project'>
      <section>
        <input type="text" name="name" id="name" placeholder='Project Name' ref={nameRef} />
        <textarea name="description" id="description" placeholder='Project Description' ref={descriptionRef}></textarea>
      </section>
      <section>
        <div>
          <h2>Partitions</h2>
          <button onClick={createPartition} className='add-partition-btn'>+</button>
        </div>
        <div>
        </div>
      </section>
      <section>
        <div>
          <h2>Start Date: </h2>
          <input type="date" name="start-date" id="start-date" ref={startRef} />
        </div>
        <div>
          <h2>Finish Date: </h2>
          <input type="date" name="finish-date" id="finish-date" ref={finishRef} />
        </div>
      </section>
      <br />
      <button onClick={handleAdd} className='add-btn'>Add Project</button>
      <button onClick={() => {
        navigate('/sessions_manager/');
      }} className='cancel-btn'>Cancel</button>
    </div>
  )
}

export default AddProject;
import React from 'react'

function AddPartition({api}) {

  async function addPartition(data, projectID) {
    const response = await api.post(`projects/${projectID}/create-partition/`);

    if (response.status === 201) {
        const data = await response.data;
    }
  }

  return (
    <div>AddPartition</div>
  )
}

export default AddPartition;
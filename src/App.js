/* src/App.js */
import React, { useEffect, useState } from 'react'
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createMember } from './graphql/mutations'
import { listMembers } from './graphql/queries'
import { Button, StylesProvider } from '@material-ui/core'

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const initialState = { name: '', description: '',  hasMetBishop: '', priesthoodOffice: '', 
  newMemberLessonsComplete: 0, ministeringPerson: '', calling: '', attendedTemple: 'no', 
  unitName: 'Murray', stakeName: 'Paducah KY' }

const App = () => {
  const [formState, setFormState] = useState(initialState)
  const [todos, setTodos] = useState([])

  useEffect(() => {
    fetchMembers()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function fetchMembers() {
    try {
      const todoData = await API.graphql(graphqlOperation(listMembers))
      const todos = todoData.data.listMembers.items
      setTodos(todos)
    } catch (err) { console.log('error fetching todos') }
  }

  async function addTodo() {
    try {
      //if (!formState.name || !formState.description) return
      if (!formState.name) {alert('oops, missing name'); return;}
      const todo = { ...formState }
      setTodos([...todos, todo])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createMember, {input: todo}))
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }

  return (
    <div style={styles.container}>
      <h2>Member Progress</h2>
      <input
        onChange={event => setInput('name', event.target.value)}
        style={styles.input}
        value={formState.name}
        placeholder="Name" 
        />      
      <Button color="primary" variant="contained" onClick={addTodo}>Create Member</Button>
      {
        todos.map((todo, index) => (
          <div key={todo.id ? todo.id : index} style={styles.todo}>
          <h1>{todo.name}</h1>
          <p style={styles.milestone}>Has met bishop: <select>
            <options>Yes</options>
            <options>No</options>
          </select></p>
          <p style={styles.milestone}>Priesthood: {todo.priesthoodOffice}</p>
          <p style={styles.milestone}>New Member lessons: {todo.newMemberLessonsComplete}</p>  
          <p style={styles.milestone}>Ministering Brother/Sister: {todo.ministeringPerson}</p>  
          <p style={styles.milestone}>Calling: {todo.calling}</p>  
          <p style={styles.milestone}>Attended Temple: {todo.attendedTemple}</p>                        
          </div>
        ))
      }
    </div>
  )
}

const styles = {
  container: { width: '50%', margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 20 },
  todo: { margin: '5px auto' , border: '1px solid #ccc', borderRadius: '1em', padding: '1em'},
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  todoDescription: { marginBottom: 0 }, 
  milestone: { display:'inline', margin:'auto 5px' }
}

export default App
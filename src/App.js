/* src/App.js */
import React, { useEffect, useState } from 'react'
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createMember } from './graphql/mutations'
import { listMembers } from './graphql/queries'

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
      if (!formState.name || !formState.description) return
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
      <input
        onChange={event => setInput('description', event.target.value)}
        style={styles.input}
        value={formState.description}
        placeholder="Description"
      />
      <input
        onChange={event => setInput('hasMetBishop', event.target.value)}
        style={styles.input}
        value={formState.hasMetBishop}
        placeholder="hasMetBishop"
      />
      <input
        onChange={event => setInput('priesthoodOffice', event.target.value)}
        style={styles.input}
        value={formState.priesthoodOffice}
        placeholder="priesthoodOffice"
      />
      <input
        onChange={event => setInput('newMemberLessonsComplete', event.target.value)}
        style={styles.input}
        value={formState.newMemberLessonsComplete}
        placeholder="newMemberLessonsComplete"
      />
      <input
        onChange={event => setInput('ministeringPerson', event.target.value)}
        style={styles.input}
        value={formState.ministeringPerson}
        placeholder="ministeringPerson"
      />
      <input
        onChange={event => setInput('calling', event.target.value)}
        style={styles.input}
        value={formState.calling}
        placeholder="calling"
      />
      <input
        onChange={event => setInput('attendedTemple', event.target.value)}
        style={styles.input}
        value={formState.attendedTemple}
        placeholder="attendedTemple"
      />
      <input
        onChange={event => setInput('unitName', event.target.value)}
        style={styles.input}
        value={formState.unitName}
        placeholder="unitName"
      />
      <input
        onChange={event => setInput('stakeName', event.target.value)}
        style={styles.input}
        value={formState.stakeName}
        placeholder="stakeName"
      />
      <button style={styles.button} onClick={addTodo}>Create Member</button>
      {
        todos.map((todo, index) => (
          <div key={todo.id ? todo.id : index} style={styles.todo}>
            <p style={styles.todoName}>{todo.name}</p>
            <p style={styles.todoDescription}>{todo.description}</p>
            <p style={styles.todoDescription}>{todo.hasMetBishop}</p>
            <p style={styles.todoDescription}>{todo.priesthoodOffice}</p>
            <p style={styles.todoDescription}>{todo.calling}</p>
          </div>
        ))
      }
    </div>
  )
}

const styles = {
  container: { width: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 20 },
  todo: {  marginBottom: 15 },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  todoDescription: { marginBottom: 0 },
  button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
}

export default App
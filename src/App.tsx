import React from 'react';
import './App.css';
import { Theme, myPresetDefault } from './themes/Theme/Theme';
import styles from './styles/styles.module.sass';
import Content from './components/Content/Content';
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router>
      <Theme preset={myPresetDefault}>
        <div className={styles.container}>
          <Content />
        </div>
      </Theme>
    </Router>
  );
}

export default App;

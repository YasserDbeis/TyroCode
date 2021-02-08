import React, {useEffect, useRef, useContext} from 'react';
import classes from './Cockpit.module.css'
import AuthContext from '../../context/auth-context';

const cockpit = props => {

    const toggleButtonRef = React.useRef(null);

    const authContext = useContext(AuthContext)

    useEffect(() => {
        console.log('[Cockpit.js] useEffect')
        toggleButtonRef.current.click()

        return () => {
            console.log('Cockpit js cleanup using useEffect')
        }
    }, [])      // passing empty array means it will only run on first time. array paramters are props/state that you can check to see if theres been a change in

    useEffect(() => {
        console.log('[Cockpit.js] 2nd useEffect')
        return () => {
            console.log('Cockpit js cleanup using 2nd useEffect')
        }
    })

    const assignedClasses = [];
    let btnClass = '';
    
    if(props.showPersons) {
        btnClass = classes.Red;
    }

    if (props.personsLength <= 2) {
      assignedClasses.push(classes.red); // classes = ['red']
    }
    if (props.personsLength <= 1) {
      assignedClasses.push(classes.bold); // classes = ['red', 'bold']
    }


    return (
        <div className={classes.Cockpit}>
            <h1>{props.title}</h1>
            <p className={assignedClasses.join(' ')}>This is really working!</p>
            <button ref={toggleButtonRef} className={btnClass} onClick={props.clicked}>
                Toggle Persons
            </button>
            <button onClick={authContext.login}>Log In</button>
        
            
        </div>
    );
}

export default React.memo(cockpit);
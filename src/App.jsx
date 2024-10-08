import { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Grid, Segment, Menu } from 'semantic-ui-react';
import "./App.css"



const Navbar = () => (
    <Menu inverted>
        <Container>
            <Menu.Item name="home" />
            {/* Add more menu items as needed */}
        </Container>
    </Menu>
);

// Simple Footer
const Footer = () => (
    <div className="footer">
        © {new Date().getFullYear()} FreePlanTour. All rights reserved.
    </div>
);



const App = () => {
    const [question, setQuestion] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null)

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!question) return;

        setChatHistory(prevHistory => [...prevHistory, { role: 'user', message: question }]);
        setQuestion('');

        try {
            const response = await axios.post('https://perplexity-chat-project.vercel.app/ask', { question });
            setChatHistory(prevHistory => [...prevHistory, { role: 'bot', message: response.data.answer }]);
        } catch (error) {
            console.error('API Error:', error);
            if (error.response) {
                setChatHistory([...chatHistory, { role: 'bot', message: 'An error occurred communicating with the chatbot. Please try again later.' }]);
            } else {
                setChatHistory([...chatHistory, { role: 'bot', message: 'There seems to be a connection issue. Please check your network and try again.' }]);
            }
        }
    };

    return (
        <div>
            <Navbar />
        <Container>
            {errorMessage && <Message negative>{errorMessage}</Message>}

            <Grid stackable>
                <Grid.Column width={12}>
                    <Segment className="chat-container">
                        <div className="chat-history">
                            {chatHistory.map((entry, index) => (
                                <div key={index} className={`message ${entry.role}`}>
                                    <b>{entry.role}: </b> {entry.message}
                                </div>
                            ))}
                        </div>
                    </Segment>
                </Grid.Column>

                <Grid.Column width={4}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Input
                            fluid
                            placeholder='Ask a question...'
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                        <Button primary type='submit'>Send</Button>
                    </Form>
                </Grid.Column>
            </Grid>
        </Container>
            <Footer />
        </div>
    );
};

export default App;


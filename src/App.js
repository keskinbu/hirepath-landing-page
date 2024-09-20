import React, {useState, useRef} from 'react';
import {createClient} from '@supabase/supabase-js';
import ReCAPTCHA from 'react-google-recaptcha';
import './App.css';
import {Helmet} from "react-helmet";

// Initialize Supabase client using environment variables
const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

const App = () => {
    const [email, setEmail] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const recaptchaRef = useRef(null);

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setModalMessage('Please enter a valid email address.');
            setShowModal(true);
            return;
        }

        setIsSubmitting(true);
        recaptchaRef.current.execute();
    };

    const handleRecaptchaChange = async (token) => {
        if (!token) {
            setModalMessage('Please complete the reCAPTCHA.');
            setShowModal(true);
            setIsSubmitting(false);
            return;
        }

        try {
            const {error} = await supabase
                .from('waiting_list')
                .insert([{email: email}]);

            if (error) {
                if (error.code === '23505') { // Unique constraint violation
                    setModalMessage('This email is already on the waiting list.');
                } else {
                    setModalMessage('An error occurred. Please try again later.');
                }
            } else {
                setModalMessage('Successfully added to the waiting list!');
                setEmail('');
            }
        } catch (error) {
            setModalMessage('An error occurred. Please try again later.');
        }

        setShowModal(true);
        setIsSubmitting(false);
    };

    return (
        <div>
            <Helmet>
                <title>Enhance Your Job Interview Skills with hirepath.ai - AI-Powered Job Interview</title>
                <meta name="description"
                      content="Experience real job interviews with hirepath.ai's advanced AI technology. Submit your job post, engage in a realistic interview, and receive valuable feedback to improve your performance. Elevate your career with AI-driven insights and prepare for success."/>
                <meta name="keywords"
                      content="AI job interview, job interview feedback, AI-powered interview, job interview preparation, hirepath.ai, job interview practice, AI interview simulator, interview feedback system, AI interview coach, job interview skills, improve interview performance"/>
            </Helmet>
            <div
                className="min-h-screen bg-gradient-to-tr from-indigo-700 to-indigo-100 flex flex-col p-4 md:p-8 text-white relative">
                <div className="flex flex-col items-center justify-center flex-grow pb-24">
                    <img
                        src="/logo.svg"
                        alt="hirepath.ai logo"
                        className="w-32 xs:w-36 sm:w-40 md:w-64 mb-8 sm:mb-16 md:mb-24"
                    />
                    <main className="flex flex-col items-center justify-center text-center w-full max-w-5xl">
                        <h1 className="text-3xl xs:text-2xl sm:text-4xl md:text-6xl font-semibold mb-4 sm:mb-6 w-full max-w-4xl text-gradient-custom">
                            Preparing for your dream job<br/>will be much easier soon!
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 opacity-90">Subscribe now to get the
                            latest updates:</p>
                        <form onSubmit={handleSubmit}
                              className="flex flex-col sm:flex-row w-full max-w-xl gap-2 sm:gap-4">
                            <input
                                type="email"
                                placeholder="Enter your e-mail address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-grow py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`bg-indigo-600 hover:bg-hover-color py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </form>
                    </main>
                </div>
                <footer className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
                    <p className="mb-2 opacity-80 text-center">Follow us on</p>
                    <div className="flex justify-center gap-4 sm:gap-6">
                        <a href="https://www.linkedin.com/company/hirepath-ai/" target="_blank" rel="noreferrer"
                           className="social-icon linkedin" aria-label="LinkedIn"></a>
                        <a href="https://www.instagram.com/hirepathai/" target="_blank" rel="noreferrer"
                           className="social-icon instagram" aria-label="Instagram"></a>
                        <a href="https://x.com/hirepathai/" target="_blank" rel="noreferrer"
                           className="social-icon twitter"
                           aria-label="X"></a>
                        <a href="https://www.facebook.com/profile.php?id=61564042228025" target="_blank"
                           rel="noreferrer"
                           className="social-icon facebook" aria-label="Facebook"></a>
                    </div>
                </footer>
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-indigo-500 p-6 rounded-lg text-center max-w-md w-full">
                            <p className="mb-4">{modalMessage}</p>
                            <button onClick={() => setShowModal(false)}
                                    className="bg-indigo-700 hover:bg-indigo-800 py-2 px-4 rounded font-semibold">
                                Close
                            </button>
                        </div>
                    </div>
                )}
                <ReCAPTCHA
                    sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                    size="invisible"
                    ref={recaptchaRef}
                    onChange={handleRecaptchaChange}
                />
            </div>
        </div>
    );
};

export default App;
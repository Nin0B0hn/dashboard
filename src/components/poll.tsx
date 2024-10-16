import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';  // Stelle sicher, dass der Supabase-Client importiert ist

export default function CreatePoll() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Poll in Supabase einfügen
    const { data, error } = await supabase
      .from('polls')
      .insert([{ question, options }]);

    if (error) {
      console.error("Error creating poll:", error);
    } else {
      console.log("Poll created successfully:", data);
    }
  };

  return (
    <div className="container">
      <h1>Create a new Poll</h1>
      <form onSubmit={handleSubmit}>
        <label>Poll Question</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />

        {options.map((option, idx) => (
          <div key={idx}>
            <label>Option {idx + 1}</label>
            <input
              type="text"
              value={option}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[idx] = e.target.value;
                setOptions(newOptions);
              }}
              required
            />
          </div>
        ))}

        <button type="button" onClick={() => setOptions([...options, ''])}>
          Add Option
        </button>

        <button type="submit">Create Poll</button>
      </form>
    </div>
  );
}

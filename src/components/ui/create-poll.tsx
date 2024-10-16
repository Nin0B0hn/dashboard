import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from '../../lib/supabaseClient';

interface Poll {
  question: string;
  options: string[];
}

export const CreatePoll = () => {
  const [question, setQuestion] = useState<string>('');
  const [options, setOptions] = useState<string[]>(['', '']);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('polls')
      .insert([{ question, options } as Poll]);
    if (error) console.error(error);
    else console.log('Poll created:', data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Poll question"
        required
      />
      {options.map((option, idx) => (
        <Input
          key={idx}
          type="text"
          value={option}
          onChange={(e) => {
            const newOptions = [...options];
            newOptions[idx] = e.target.value;
            setOptions(newOptions);
          }}
          placeholder={`Option ${idx + 1}`}
          required
        />
      ))}
      <Button type="button" onClick={() => setOptions([...options, ''])}>
        Add Option
      </Button>
      <Button type="submit">Create Poll</Button>
    </form>
  );
};

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface PollResultsProps {
  pollId: string;
}

interface Vote {
  poll_id: string;
  option_selected: string;
}

export const PollResults = ({ pollId }: PollResultsProps) => {
  const [results, setResults] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    // Starte die Abfrage nach der bestehenden Abstimmungsstatistik
    const fetchResults = async () => {
      const { data: votes, error } = await supabase
        .from('votes')
        .select('*')
        .eq('poll_id', pollId);

      if (error) {
        console.error('Error fetching poll results:', error);
      } else {
        const resultsMap = votes.reduce((acc: { [key: string]: number }, vote: Vote) => {
          acc[vote.option_selected] = (acc[vote.option_selected] || 0) + 1;
          return acc;
        }, {});
        setResults(resultsMap);
      }
    };

    fetchResults();

    // Realtime Updates über den Channel abonnieren
    const channel = supabase
      .channel(`votes:poll_id=eq.${pollId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'votes', filter: `poll_id=eq.${pollId}` },
        (payload) => {
          const newVote = payload.new as Vote;
          setResults((prevResults) => ({
            ...prevResults,
            [newVote.option_selected]: (prevResults[newVote.option_selected] || 0) + 1,
          }));
        }
      )
      .subscribe();

    // Cleanup: Channel beim Verlassen der Komponente entfernen
    return () => {
      supabase.removeChannel(channel);
    };
  }, [pollId]);

  return (
    <div>
      <h3>Results</h3>
      {Object.keys(results).map((option) => (
        <div key={option}>
          {option}: {results[option]}
        </div>
      ))}
    </div>
  );
};

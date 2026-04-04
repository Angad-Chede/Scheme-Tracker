import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { SCHEMES } from '../data';

export default function SeedSchemes() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  async function seedData() {
    try {
      setLoading(true);
      setMsg('');

      const { error } = await supabase.from('schemes').upsert(SCHEMES, {
        onConflict: 'id',
      });

      if (error) {
        console.error('Seed error:', error);
        setMsg(`❌ Error: ${error.message}`);
      } else {
        setMsg('✅ Schemes seeded successfully!');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setMsg(`❌ Unexpected error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '40px', color: 'white', background: '#0b1220', minHeight: '100vh' }}>
      <h1>Seed Schemes to Supabase</h1>
      <p>This is a temporary page. Click once to upload all schemes.</p>

      <button
        onClick={seedData}
        disabled={loading}
        style={{
          padding: '12px 20px',
          borderRadius: '10px',
          border: 'none',
          background: '#2563eb',
          color: 'white',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        {loading ? 'Seeding...' : 'Seed Schemes'}
      </button>

      {msg && <p style={{ marginTop: '20px' }}>{msg}</p>}
    </div>
  );
}
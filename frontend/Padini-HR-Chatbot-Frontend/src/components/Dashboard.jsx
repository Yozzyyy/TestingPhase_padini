import { knowledgeBaseData } from '../data/kbData';

export default function Dashboard({ searchQuery, setSearchQuery, openFaqs, toggleFaq }) {
  const filteredData = knowledgeBaseData.map(section => {
    const matchedItems = section.items.filter(item => 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...section, items: matchedItems };
  }).filter(section => section.items.length > 0);

  return (
    <div className="animate-fade-in">
      <header className="kb-header">
        <h1 className="kb-title">Padini Group Staff Resources</h1>
        <div className="search-box-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Search standard operating procedures, SKU guidelines..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <div className="kb-grid">
        {filteredData.map((section) => (
          <div className="category-section" key={section.id}>
            <h3 className="category-title">{section.category}</h3>
            {section.items.map((item) => {
              const isOpen = !!openFaqs[item.id];
              return (
                <div className="accordion-item" key={item.id}>
                  <button className="accordion-header" onClick={() => toggleFaq(item.id)}>
                    <span>{item.question}</span>
                    <svg className={`accordion-icon ${isOpen ? 'open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  <div className={`accordion-body ${isOpen ? 'open' : ''}`} style={{ maxHeight: isOpen ? '200px' : '0px' }}>
                    <div className="accordion-content">{item.answer}</div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        {filteredData.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '3rem 1rem', textAlign: 'center', color: 'var(--padini-stone-dark)' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <p style={{ fontWeight: '700' }}>No procedures found matching your query</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Try looking up generic keywords like "stock", "exchange", or "code".</p>
          </div>
        )}
      </div>
    </div>
  );
}
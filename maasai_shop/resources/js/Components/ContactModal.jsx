import React from 'react';
import { router } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';

function ContactModal({ allContacts, contacts }) {

    const toggleSeen = (id) => {
        router.put(`/admin/contacts/${id}/toggle-seen`, {}, {
            onSuccess: () => {
                // Optionally handle success actions
            }
        });
    };

    return (
        <div>
            <h1>Contact Messages</h1>
            {contacts && contacts.map(contact => (
                <div key={contact.id} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
                    <p><strong>Name:</strong> {contact.name}</p>
                    <p><strong>Email:</strong> {contact.email}</p>
                    <p><strong>Message:</strong> {contact.message}</p>
                    <label>
                        Seen:
                        <input
                            type="checkbox"
                            checked={contact.is_seen}
                            onChange={() => toggleSeen(contact.id)}
                        />
                    </label>
                </div>
            ))}
            {contacts.length === 0 && 
                <div style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
                    <p>No new messages to see.</p>
                </div>
            }
        </div>
    );
}

export default ContactModal;
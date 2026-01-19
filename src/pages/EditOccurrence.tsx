import React, { useState } from 'react';
import { useUpsertOccurrenceMutation } from "../store/apis/api"; 

import type { EditOccurrenceDto } from "../types/newEditOccurrenceDTO";
import type { ActivityOccurrence } from "../types/activityOccurrence";

interface EditOccurrenceProps {
  activity: ActivityOccurrence;
  onSaved?: () => void; // optional callback efter save
}

const EditOccurrence: React.FC<EditOccurrenceProps> = ({ activity, onSaved }) => {
  const [upsertOccurrence, { isLoading }] = useUpsertOccurrenceMutation();

  // Local state for form fields
  const [title, setTitle] = useState(activity.title);
  const [description, setDescription] = useState(activity.description ?? '');
  const [address, setAddress] = useState(activity.address ?? '');
  const [tag, setTag] = useState(activity.tag ?? '');
  const [startUtc, setStartUtc] = useState(activity.startUtc);
  const [endUtc, setEndUtc] = useState(activity.endUtc);
  const [isCancelled, setIsCancelled] = useState(activity.cancelled);
  const [selectedInstructorIds, setSelectedInstructorIds] = useState<number[]>(
    activity.instructors.map((i) => i.id)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: EditOccurrenceDto = {
      activityId: activity.activityId,
      originalStartUtc: activity.originalStartUtc,
      startUtc,
      endUtc,
      title,
      description: description || null,
      address: address || null,
      tag: tag || null,
      isCancelled,
      instructorIds: selectedInstructorIds,
    };

    try {
      await upsertOccurrence(payload).unwrap();
      if (onSaved) onSaved();
      alert('Session saved!');
    } catch (err) {
      console.error(err);
      alert('Failed to save session.');
    }
  };

  const toggleInstructor = (id: number) => {
    setSelectedInstructorIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-4">
      <div>
        <label className="block font-semibold">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </div>

      <div>
        <label className="block font-semibold">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block font-semibold">Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block font-semibold">Tag</label>
        <input
          type="text"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block font-semibold">Start UTC</label>
        <input
          type="datetime-local"
          value={startUtc.slice(0, 16)}
          onChange={(e) => setStartUtc(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </div>

      <div>
        <label className="block font-semibold">End UTC</label>
        <input
          type="datetime-local"
          value={endUtc.slice(0, 16)}
          onChange={(e) => setEndUtc(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </div>

      <div>
        <label className="block font-semibold">Cancelled</label>
        <input
          type="checkbox"
          checked={isCancelled}
          onChange={(e) => setIsCancelled(e.target.checked)}
        />
      </div>

      <div>
        <label className="block font-semibold">Instructors</label>
        <div className="space-y-1">
          {activity.instructors.map((instr) => (
            <label key={instr.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedInstructorIds.includes(instr.id)}
                onChange={() => toggleInstructor(instr.id)}
              />
              <span>{instr.firstName}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isLoading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
};

export default EditOccurrence;

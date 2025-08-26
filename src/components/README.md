# Job Question Modal Component

A responsive React component styled with Tailwind CSS for displaying a job question modal in subscription cancellation flows.

## Features

- ✅ **Responsive Design**: Two columns on desktop, stacked vertically on mobile
- ✅ **Accessible**: Proper ARIA labels and keyboard navigation
- ✅ **Customizable**: Easy to modify styling and content
- ✅ **TypeScript**: Fully typed with interfaces
- ✅ **Tailwind CSS**: Modern utility-first styling

## Component Structure

### JobQuestionModal.tsx
The main modal component with the following features:

- **Centered modal card** with white background, rounded corners, and soft shadow
- **Header**: "Subscription Cancellation" centered at the top
- **Close button**: X button positioned in the top-right corner
- **Left side**: Text content and action buttons
- **Right side**: Image with rounded corners
- **Responsive layout**: Adapts from mobile to desktop

## Usage

### Basic Implementation

```tsx
import JobQuestionModal from './components/JobQuestionModal';

function MyComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleYesFoundJob = () => {
    console.log('User found a job');
    setIsModalOpen(false);
  };

  const handleStillLooking = () => {
    console.log('User is still looking');
    setIsModalOpen(false);
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>
        Open Modal
      </button>

      {isModalOpen && (
        <JobQuestionModal
          onClose={() => setIsModalOpen(false)}
          onYesFoundJob={handleYesFoundJob}
          onStillLooking={handleStillLooking}
        />
      )}
    </div>
  );
}
```

### Props Interface

```tsx
interface JobQuestionModalProps {
  onClose: () => void;           // Function called when modal is closed
  onYesFoundJob: () => void;     // Function called when "Yes" button is clicked
  onStillLooking: () => void;    // Function called when "Still looking" button is clicked
}
```

## Styling Details

### Modal Container
```tsx
<div className="fixed inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center p-4 z-50">
  <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full overflow-hidden relative">
```

### Typography
- **Headline**: `text-2xl lg:text-3xl font-bold text-gray-900`
- **Subheadline**: `text-3xl lg:text-4xl font-bold italic text-gray-900`
- **Supporting text**: `text-lg text-gray-600 leading-relaxed`

### Buttons
```tsx
className="w-full px-8 py-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
```

### Responsive Layout
- **Mobile**: `flex-col` (stacked vertically)
- **Desktop**: `lg:flex-row` (side-by-side)
- **Image height**: `h-64 lg:h-96` (responsive height)

## Customization

### Changing Colors
Modify the Tailwind classes to match your brand colors:

```tsx
// Change background color
<div className="bg-white"> // Change to your brand color

// Change button colors
<button className="bg-white border border-gray-300"> // Modify as needed
```

### Changing Content
Update the text content directly in the component:

```tsx
<h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
  Your Custom Headline Here
</h1>
```

### Changing Image
Replace the image source:

```tsx
<Image
  src="/your-image.jpg"  // Change to your image path
  alt="Your image description"
  fill
  className="object-cover rounded-r-2xl"
  priority
/>
```

## Demo

See `ModalDemo.tsx` for a complete example of how to implement and use the component.

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Mobile responsive (iOS Safari, Chrome Mobile, etc.)
- Accessible with screen readers

## Dependencies

- React 18+
- Next.js (for Image component)
- Tailwind CSS
- TypeScript

## Installation

The component is ready to use in your Next.js project. Make sure you have the required dependencies installed:

```bash
npm install react next tailwindcss
``` 
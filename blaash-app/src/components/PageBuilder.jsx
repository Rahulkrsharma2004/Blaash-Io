import { useState, useEffect } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Draggable = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    transform: `translate3d(${transform?.x}px, ${transform?.y}px, 0)`,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-4 mb-4 border border-gray-300 rounded bg-gray-100 cursor-grab"
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
};

const Droppable = ({ id, children }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="p-4 border-2 border-dashed border-gray-400 rounded">
      {children}
    </div>
  );
};

const LabelComponent = () => <label className="block mb-2 text-sm font-medium text-gray-700">Label</label>;

const InputComponent = () => <input type="text" className="w-full p-2 border border-gray-300 rounded mb-4" />;

const CheckboxComponent = () => (
  <div className="flex items-center mb-4">
    <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
    <label className="ml-2 block text-sm text-gray-900">Checkbox</label>
  </div>
);

const ButtonComponent = () => <button className="px-4 py-2 bg-blue-500 text-white rounded">Button</button>;

const TableComponent = () => (
  <table className="min-w-full bg-white border border-gray-300">
    <thead>
      <tr>
        <th className="py-2 px-4 border-b">Header 1</th>
        <th className="py-2 px-4 border-b">Header 2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="py-2 px-4 border-b">Row 1 Col 1</td>
        <td className="py-2 px-4 border-b">Row 1 Col 2</td>
      </tr>
    </tbody>
  </table>
);

function PageBuilder() {
  const [layout, setLayout] = useState([]);
  const [layoutName, setLayoutName] = useState('');

  useEffect(() => {
    setLayout([]);
  }, []);

  const handleDragEnd = (event) => {
    const { id } = event.active;
    setLayout([...layout, { id }]);
  };

  const saveLayout = async () => {
    if (!layoutName.trim()) {
      toast.error('Please enter a layout name.');
      return;
    }

    try {
      await setDoc(doc(db, 'layouts', layoutName), { layout });
      toast.success('Layout saved to Firebase!');
    } catch (error) {
      console.error('Error saving layout to Firebase:', error);
      toast.error('Failed to save layout.');
    }
  };

  const loadLayout = async () => {
    if (!layoutName.trim()) {
      toast.error('Please enter a layout name.');
      return;
    }

    try {
      const docRef = doc(db, 'layouts', layoutName);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLayout(docSnap.data().layout);
        toast.success('Layout loaded from Firebase!');
      } else {
        toast.error('No layout found with that name.');
      }
    } catch (error) {
      console.error('Error loading layout from Firebase:', error);
      toast.error('Failed to load layout.');
    }
  };

  const publishPage = () => {
    const newWindow = window.open();
    newWindow.document.write("<html><body><h1>Published Page</h1><div>");
    layout.forEach((item) => {
      newWindow.document.write(`<div>${item.id}</div>`);
    });
    newWindow.document.write("</div></body></html>");
  };

  const renderComponent = (id) => {
    switch (id) {
      case 'Label':
        return <LabelComponent />;
      case 'Input':
        return <InputComponent />;
      case 'Checkbox':
        return <CheckboxComponent />;
      case 'Button':
        return <ButtonComponent />;
      case 'Table':
        return <TableComponent />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <ToastContainer />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="left-container">
          <h2 className="text-lg font-semibold mb-4">Drag & Drop Controls</h2>
          <DndContext onDragEnd={handleDragEnd}>
            <div className="control-panel space-y-4">
              <Draggable id="Label">Label</Draggable>
              <Draggable id="Input">Input Box</Draggable>
              <Draggable id="Checkbox">Checkbox</Draggable>
              <Draggable id="Button">Button</Draggable>
              <Draggable id="Table">Table</Draggable>
            </div>
          </DndContext>
        </div>

        <div className="right-container">
          <input
            type="text"
            placeholder="Enter Layout Name"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={layoutName}
            onChange={(e) => setLayoutName(e.target.value)}
          />

          <div className="flex space-x-4 mb-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={saveLayout}>
              Save Layout
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={loadLayout}>
              Load Layout
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={publishPage}>
              Publish
            </button>
          </div>

          <Droppable id="drop-zone">
            <h2 className="text-lg font-semibold mb-4">Drop Zone</h2>
            {layout.map((item, index) => (
              <div key={index} className="p-2 mb-2 border border-gray-300 rounded">
                {renderComponent(item.id)}
              </div>
            ))}
          </Droppable>
        </div>
      </div>
    </div>
  );
}

export default PageBuilder;

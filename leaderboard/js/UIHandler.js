// Handles UI operations
export class UIHandler {

    // Append a child to parent node
    appendElement(parent,child) {
        parent.appendChild(child);
    }

    // Create a new element
    createElement(elementType) {
        return document.createElement(elementType);
    }

    // Get an existing element
    getElement(id) {
        return document.getElementById(id);
    }

    // Get a query 
    getQuery(name) {
        return document.querySelector(name);
    }

    // Gets the value of an element
    getElementValue(id) {
        return this.getElement(id).value;
    }

    // Remove an elements children
    removeElementsChildren(element) {
        while(element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    // Reset an input form 
    resetForm(id) {
        this.getElement(id).reset();
    }

    // Set an elements text
    setElementText(element,text) {
        element.textContent = text;
    }
}
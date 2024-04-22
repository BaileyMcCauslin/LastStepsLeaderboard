// Handles Events
export class EventHandler {
    constructor(table,UiHandler,databaseConnector,page) {
        this.page = page;
        this.table = table;
        this.UIHandler = UiHandler;
        this.database = databaseConnector;
        this.events = {
            "registration": ["registration-form","submit",
                                                        this.handleSignUpEvent],
            "leaderboard": ["search","submit", this.handlePlayerSearchEvent],
        };
    }

    // Attach event listeners to filter drop down
    attachDropDownListeners() {
        const filterBtn = this.UIHandler.getQuery('.filter-btn');
        const dropdownContent = this.UIHandler.getQuery('.dropdown-content');
        const filterItems = ["time","round","endless"];

        // Save the current object in a temp, refering to "this" in events
        // refers to a different object.(The more you know!)
        const self = this;
      
        filterBtn.addEventListener('click', () => {
            dropdownContent.classList.toggle('show');
        });
      
        dropdownContent.addEventListener('click', (event) => {
            if(event.target.tagName === 'A') {
                dropdownContent.classList.remove('show');
            }
        });
      
        function attachClickListener(filter) {
            const element = self.UIHandler.getElement(filter);
            element.addEventListener('click', function() {
                self.table.sortTable(filter);
                // Prevent default behavior of anchor tag
                return false;
            });
        }
    
        for(let filterItem in filterItems) {
            attachClickListener(filterItems[filterItem]);
        }
    }
    

    // Get all values from the registration form
    getRegistrationFormValues() {
        return { "displayName": this.UIHandler.getElementValue("name"),
                 "email": this.UIHandler.getElementValue("email"),
                 "password": this.UIHandler.getElementValue("password"),
        };
    }

    // Get the player search name value
    getPlayerSearchValue() {
        return {"name":this.UIHandler.getElementValue("player-name")};
    }

    // Handle player search
    handlePlayerSearchEvent = async (event) => {
        event.preventDefault();
        const playerName = this.getPlayerSearchValue();

        if(playerName.name.length > 0) {
            try {
                const playerRecords = await 
                                   this.database.handlePlayerSearch(playerName);
                this.table.resetTable(playerRecords);
            } catch(error) {
                console.error(error);
            }
        }
    }

    // Handles the signup event
    handleSignUpEvent = async (event) =>  {
        event.preventDefault();
        try {
            await this.database.handleSignUp(this.getRegistrationFormValues());
        } catch(error) {
            console.error(error);
        }
    }

    // Initilize events
    initEvents() {
        for(const activeEvent in this.events) {
            if(activeEvent === this.page) {
                const [id,action,func] = this.events[activeEvent];
                const element = this.UIHandler.getElement(id);
                element.addEventListener(action,(event) => func(event));
            }
        }
    }
}
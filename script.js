const app = Vue.createApp({
  data() {
    return {
      currentTime: null,
      greeting:null,
      currency: "₹",
      balance: null,
      income: null,
      expense: null,
      history: [],
      transaction: {
        id: Date.now(),
        text: null,
        type: "expence",
        amount: null,
      },
      isFormActive: false,
    };
  },
  created() {
    this.getCurrentTimeDate();
    if (localStorage.getItem("budget-history")) {
      this.history = JSON.parse(localStorage.getItem("budget-history"));
    }
  },
  methods: {
    toggleForm() {
      this.isFormActive = !this.isFormActive;
    },
    formatIndianCommaSystem(number) {
      if (!!number) {
        const str = number.toString();
        if (str.length <= 3) return str; // Handles numbers with 3 or fewer digits

        // Separate the last three digits
        const lastThree = str.slice(-3);
        // Get the rest of the number
        const otherNumbers = str.slice(0, -3);

        // Format the rest of the number
        const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");

        return formatted + "," + lastThree;
      }
    },
    removeItem(id) {
        if (window.confirm("Are you sure you want to delete?")) {
            // Use filter to remove the item with the matching id
            this.history = this.history.filter(item => item.id !== id);
            // Save the updated history to localStorage
            localStorage.setItem("budget-history", JSON.stringify(this.history));
        }
    },
    clearHistory() {
      if (window.confirm("Are you sure you want to clear the history?")) {
        localStorage.removeItem("budget-history");
        this.history = [];
      }
    },
    saveTransaction() {
      if (
        !!this.transaction.text &&
        !!this.transaction.type &&
        !!this.transaction.amount
      ) {
        this.history.push(this.transaction);
        localStorage.setItem("budget-history", JSON.stringify(this.history));
        this.transaction = {
          id: Date.now(),
          text: null,
          type: "expence",
          amount: null,
        };
        this.isFormActive = false;
      } else {
        alert("Please fill all the fields");
      }
    },
    getCurrentTimeDate() {
      let currentTimeDate = new Date();
      var hours = currentTimeDate.getHours();
      var minutes = currentTimeDate.getMinutes();
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var AMPM = hours >= 12 ? "PM" : "AM";
      if (hours === 12) {
        hours = 12;
      } else {
        hours = hours % 12;
      }
      this.currentTime = `${hours}:${minutes}${AMPM}`;
      setTimeout(this.getCurrentTimeDate, 500);
    },
  },
  watch: {
    history: {
      handler(val) {
        let tempIncome = 0;
        let tempExpense = 0;
        let tempBalance = 0;
        if (!!val && val.length > 0) {
          this.history.forEach((element) => {
            element.type === "income"
              ? (tempIncome += element.amount)
              : (tempExpense += element.amount);
          });
          tempBalance = tempIncome - tempExpense;

          this.income = tempIncome;
          this.expense = tempExpense;
          this.balance = tempBalance;
        } else {
          this.balance = null;
          this.income = null;
          this.expense = null;
        }
      },
      immediate: true,
      deep: true,
    },
    currentTime:{
        handler(val){
            if (!!val) {
                const hours = val.split(":")[0]
                if (hours >= 0 && hours < 12) {
                    this.greeting = 'Good Morning';
                }else if (hours >= 12 && hours < 17) {
                    this.greeting = 'Good Afternoon';
                }else if (hours >= 17 && hours < 20) {
                    this.greeting = 'Good Evening';
                }else{
                    this.greeting = 'Good Night';
                }
            }
        }
    }
  },
});

app.mount("#app");

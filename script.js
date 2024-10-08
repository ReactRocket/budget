const app = Vue.createApp({
  data() {
    return {
      currentTime: null,
      greeting: null,
      currency: "₹",
      balance: null,
      loanDeductedBalance: null,
      income: null,
      expense: null,
      loan: null,
      history: [],
      transaction: {
        id: Date.now(),
        text: null,
        type: "expense", // Updated to support "loan"
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
    getFullTime(timeInMilliseconds){
      // Convert to a Date object
      const date = new Date(timeInMilliseconds);
      return [date.toLocaleTimeString(), date.toLocaleDateString()]; // Full date with time
    },
    toggleForm() {
      this.isFormActive = !this.isFormActive;
    },
    formatIndianCommaSystem(number) {
      if (!!number) {
        const str = number.toString();
        if (str.length <= 3) return str; // Handles numbers with 3 or fewer digits

        const lastThree = str.slice(-3);
        const otherNumbers = str.slice(0, -3);
        const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");

        return formatted + "," + lastThree;
      }
    },
    removeItem(id) {
      if (window.confirm("Are you sure you want to delete?")) {
        this.history = this.history.filter(item => item.id !== id);
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
      if (!!this.transaction.text && !!this.transaction.type && !!this.transaction.amount) {
        this.history.push({ ...this.transaction, id: Date.now() });
        localStorage.setItem("budget-history", JSON.stringify(this.history));
        this.transaction = {
          id: Date.now(),
          text: null,
          type: "expense",
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
      hours = hours % 12 || 12; // Adjust for 12-hour format
      this.currentTime = `${hours}:${minutes}${AMPM}`;
      setTimeout(this.getCurrentTimeDate, 500);
    },
  },
  watch: {
    history: {
      handler(val) {
        let tempIncome = 0;
        let tempExpense = 0;
        let tempLoan = 0;
        let tempBalance = 0;
        let tempLoanDeductedBalance = 0;

        if (!!val && val.length > 0) {
          this.history.forEach((element) => {
            if (element.type === "income") tempIncome += element.amount;
            else if (element.type === "expense") tempExpense += element.amount;
            else if (element.type === "loan") tempLoan += element.amount;
          });
          tempBalance = tempIncome - tempExpense;
          tempLoanDeductedBalance = tempIncome - (tempExpense + tempLoan);

          this.income = tempIncome;
          this.expense = tempExpense;
          this.loan = tempLoan;
          this.balance = tempBalance;
          this.loanDeductedBalance = tempLoanDeductedBalance;
        } else {
          this.balance = this.income = this.expense = this.loan = this.loanDeductedBalance = null;
        }
      },
      immediate: true,
      deep: true,
    },
    currentTime: {
      handler(val) {
        if (!!val) {
          const hours = val.split(":")[0];
          if (hours >= 0 && hours < 12) this.greeting = "Good Morning";
          else if (hours >= 12 && hours < 17) this.greeting = "Good Afternoon";
          else if (hours >= 17 && hours < 20) this.greeting = "Good Evening";
          else this.greeting = "Good Night";
        }
      }
    }
  },
});

app.mount("#app");

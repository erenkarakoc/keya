import { ID } from "../../../../../_metronic/helpers"
import { EmployerTransaction, OfficeTransaction, Transaction } from "./_models"

import { firebaseConfig } from "../../../../../firebase/BaseConfig"
import { initializeApp } from "firebase/app"
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  CollectionReference,
  query,
  where,
  addDoc,
} from "firebase/firestore"

initializeApp(firebaseConfig)
const db = getFirestore()

const newTransaction = async (transaction: Transaction) => {
  try {
    const transactionDocRef = await addDoc(
      collection(db, "transactions"),
      transaction
    )

    await updateDoc(transactionDocRef, {
      id: transactionDocRef.id,
      ...transaction,
    })

    return { id: transactionDocRef.id, ...transaction }
  } catch (error) {
    console.error("Error adding transaction: ", error)
    throw error
  }
}

const newEmployerTransaction = async (
  employerTransaction: EmployerTransaction
) => {
  try {
    const transactionDocRef = await addDoc(
      collection(db, "employer-transactions"),
      employerTransaction
    )

    await updateDoc(transactionDocRef, {
      id: transactionDocRef.id,
      ...employerTransaction,
    })

    return { id: transactionDocRef.id, ...employerTransaction }
  } catch (error) {
    console.error("Error adding employer transaction: ", error)
    throw error
  }
}

const newOfficeTransaction = async (officeTransaction: OfficeTransaction) => {
  try {
    const transactionDocRef = await addDoc(
      collection(db, "office-transactions"),
      officeTransaction
    )

    await updateDoc(transactionDocRef, {
      id: transactionDocRef.id,
      ...officeTransaction,
    })

    return { id: transactionDocRef.id, ...officeTransaction }
  } catch (error) {
    console.error("Error adding office transaction: ", error)
    throw error
  }
}

const getAllTransactions = async (): Promise<Transaction[]> => {
  try {
    const db = getFirestore()
    const transactionCollectionRef = collection(db, "transactions")
    const transactionDocSnapshot = await getDocs(transactionCollectionRef)

    const transactions: Transaction[] = []

    transactionDocSnapshot.forEach((doc) => {
      const transactionData = doc.data() as Transaction
      transactions.push({ ...transactionData, id: doc.id })
    })

    return transactions
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return []
  }
}

const getAllEmployerTransactions = async (): Promise<EmployerTransaction[]> => {
  try {
    const db = getFirestore()
    const transactionCollectionRef = collection(db, "employer-transactions")
    const transactionDocSnapshot = await getDocs(transactionCollectionRef)

    const employerTransactions: EmployerTransaction[] = []

    transactionDocSnapshot.forEach((doc) => {
      const transactionData = doc.data() as EmployerTransaction
      employerTransactions.push({ ...transactionData, id: doc.id })
    })

    return employerTransactions
  } catch (error) {
    console.error("Error fetching employer transactions:", error)
    return []
  }
}

const getAllOfficeTransactions = async (): Promise<OfficeTransaction[]> => {
  try {
    const db = getFirestore()
    const transactionCollectionRef = collection(db, "office-transactions")
    const transactionDocSnapshot = await getDocs(transactionCollectionRef)

    const officeTransactions: OfficeTransaction[] = []

    transactionDocSnapshot.forEach((doc) => {
      const transactionData = doc.data() as OfficeTransaction
      officeTransactions.push({ ...transactionData, id: doc.id })
    })

    return officeTransactions
  } catch (error) {
    console.error("Error fetching office transactions:", error)
    return []
  }
}

const getTransactionById = async (
  id: string
): Promise<Transaction | undefined> => {
  try {
    const db = getFirestore()
    const transactionDocRef = doc(db, "transactions", id)
    const transactionDocSnapshot = await getDoc(transactionDocRef)

    if (transactionDocSnapshot.exists()) {
      return transactionDocSnapshot.data() as Transaction
    } else {
      return undefined
    }
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return undefined
  }
}

const getEmployerTransactionById = async (
  id: string
): Promise<EmployerTransaction | undefined> => {
  try {
    const db = getFirestore()
    const transactionDocRef = doc(db, "employer-transactions", id)
    const transactionDocSnapshot = await getDoc(transactionDocRef)

    if (transactionDocSnapshot.exists()) {
      return transactionDocSnapshot.data() as EmployerTransaction
    } else {
      return undefined
    }
  } catch (error) {
    console.error("Error fetching employer transactions:", error)
    return undefined
  }
}

const getOfficeTransactionById = async (
  id: string
): Promise<OfficeTransaction | undefined> => {
  try {
    const db = getFirestore()
    const transactionDocRef = doc(db, "office-transactions", id)
    const transactionDocSnapshot = await getDoc(transactionDocRef)

    if (transactionDocSnapshot.exists()) {
      return transactionDocSnapshot.data() as OfficeTransaction
    } else {
      return undefined
    }
  } catch (error) {
    console.error("Error fetching office transactions:", error)
    return undefined
  }
}

const getTransactionsByUserId = async (
  userId: string
): Promise<Transaction[]> => {
  try {
    const db = getFirestore()
    const transactionsRef = collection(
      db,
      "transactions"
    ) as CollectionReference<Transaction>
    const q = query(transactionsRef, where("userId", "==", userId))
    const querySnapshot = await getDocs(q)

    const transactions: Transaction[] = []
    querySnapshot.forEach((doc) => {
      transactions.push(doc.data())
    })

    return transactions
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return []
  }
}

const getEmployerTransactionsByUserId = async (
  userId: string
): Promise<EmployerTransaction[]> => {
  try {
    const db = getFirestore()
    const transactionsRef = collection(
      db,
      "employer-transactions"
    ) as CollectionReference<EmployerTransaction>
    const q = query(transactionsRef, where("userId", "==", userId))
    const querySnapshot = await getDocs(q)

    const employerTransactions: EmployerTransaction[] = []
    querySnapshot.forEach((doc) => {
      employerTransactions.push(doc.data())
    })

    return employerTransactions
  } catch (error) {
    console.error("Error fetching employer transactions:", error)
    return []
  }
}

const getTransactionsByOfficeId = async (
  officeId: string
): Promise<Transaction[]> => {
  try {
    const db = getFirestore()
    const transactionsRef = collection(
      db,
      "transactions"
    ) as CollectionReference<Transaction>
    const q = query(transactionsRef, where("officeId", "==", officeId))
    const querySnapshot = await getDocs(q)

    const transactions: Transaction[] = []
    querySnapshot.forEach((doc) => {
      transactions.push(doc.data())
    })

    return transactions
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return []
  }
}

const getEmployerTransactionsByOfficeId = async (
  officeId: string
): Promise<EmployerTransaction[]> => {
  try {
    const db = getFirestore()
    const transactionsRef = collection(
      db,
      "employer-ransactions"
    ) as CollectionReference<EmployerTransaction>
    const q = query(transactionsRef, where("officeId", "==", officeId))
    const querySnapshot = await getDocs(q)

    const employerTransactions: EmployerTransaction[] = []
    querySnapshot.forEach((doc) => {
      employerTransactions.push(doc.data())
    })

    return employerTransactions
  } catch (error) {
    console.error("Error fetching employer transactions:", error)
    return []
  }
}

const getOfficeTransactionsByOfficeId = async (
  officeId: string
): Promise<OfficeTransaction[]> => {
  try {
    const db = getFirestore()
    const transactionsRef = collection(
      db,
      "office-ransactions"
    ) as CollectionReference<OfficeTransaction>
    const q = query(transactionsRef, where("officeId", "==", officeId))
    const querySnapshot = await getDocs(q)

    const officeTransactions: OfficeTransaction[] = []
    querySnapshot.forEach((doc) => {
      officeTransactions.push(doc.data())
    })

    return officeTransactions
  } catch (error) {
    console.error("Error fetching office transactions:", error)
    return []
  }
}

const getTransactionsByPropertyId = async (
  propertyId: string
): Promise<Transaction[]> => {
  try {
    const db = getFirestore()
    const transactionsRef = collection(
      db,
      "transactions"
    ) as CollectionReference<Transaction>
    const q = query(transactionsRef, where("propertyId", "==", propertyId))
    const querySnapshot = await getDocs(q)

    const transactions: Transaction[] = []
    querySnapshot.forEach((doc) => {
      transactions.push(doc.data())
    })

    return transactions
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return []
  }
}

const parseDateString = (dateString: string): number =>
  new Date(dateString).getTime()

const getThisMonthsTransactions = async (): Promise<Transaction[]> => {
  try {
    const allTransactions = await getAllTransactions()

    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ).getTime()
    const endOfMonth =
      new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      ).getTime() +
      (24 * 60 * 60 * 1000 - 1)

    const thisMonthsTransactions = allTransactions.filter((transaction) => {
      const transactionDate = parseDateString(transaction.createdAt)
      return transactionDate >= startOfMonth && transactionDate <= endOfMonth
    })

    return thisMonthsTransactions
  } catch (error) {
    console.error("Error fetching this month's transactions:", error)
    return []
  }
}

const getThisMonthsEmployerTransactions = async (): Promise<
  EmployerTransaction[]
> => {
  try {
    const allEmployerTransactions = await getAllEmployerTransactions()

    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ).getTime()
    const endOfMonth =
      new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      ).getTime() +
      (24 * 60 * 60 * 1000 - 1)

    const thisMonthsEmployerTransactions = allEmployerTransactions.filter(
      (employerTransaction) => {
        const transactionDate = parseDateString(employerTransaction.createdAt)
        return transactionDate >= startOfMonth && transactionDate <= endOfMonth
      }
    )

    return thisMonthsEmployerTransactions
  } catch (error) {
    console.error("Error fetching this month's transactions:", error)
    return []
  }
}

const getThisMonthsOfficeTransactions = async (): Promise<
  OfficeTransaction[]
> => {
  try {
    const allOfficeTransactions = await getAllOfficeTransactions()

    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ).getTime()
    const endOfMonth =
      new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      ).getTime() +
      (24 * 60 * 60 * 1000 - 1)

    const thisMonthsOfficeTransactions = allOfficeTransactions.filter(
      (officeTransaction) => {
        const transactionDate = parseDateString(officeTransaction.createdAt)
        return transactionDate >= startOfMonth && transactionDate <= endOfMonth
      }
    )

    return thisMonthsOfficeTransactions
  } catch (error) {
    console.error("Error fetching this month's transactions:", error)
    return []
  }
}

const getThisMonthsTransactionsByUserId = async (
  userId: string
): Promise<Transaction[]> => {
  try {
    const allTransactions = await getAllTransactions()

    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ).getTime()
    const endOfMonth =
      new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      ).getTime() +
      (24 * 60 * 60 * 1000 - 1)

    const thisMonthsTransactions = allTransactions.filter((transaction) => {
      const transactionDate = parseDateString(transaction.createdAt)
      return (
        transaction.userIds.includes(userId) &&
        transactionDate >= startOfMonth &&
        transactionDate <= endOfMonth
      )
    })

    return thisMonthsTransactions
  } catch (error) {
    console.error("Error fetching this month's transactions by user ID:", error)
    return []
  }
}

const getThisMonthsEmployerTransactionsByUserId = async (
  userId: string
): Promise<EmployerTransaction[]> => {
  try {
    const allEmployerTransactions = await getAllEmployerTransactions()

    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ).getTime()
    const endOfMonth =
      new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      ).getTime() +
      (24 * 60 * 60 * 1000 - 1)

    const thisMonthsEmployerTransactions = allEmployerTransactions.filter(
      (employerTransaction) => {
        const transactionDate = parseDateString(employerTransaction.createdAt)
        return (
          employerTransaction.userId.includes(userId) &&
          transactionDate >= startOfMonth &&
          transactionDate <= endOfMonth
        )
      }
    )

    return thisMonthsEmployerTransactions
  } catch (error) {
    console.error("Error fetching this month's transactions by user ID:", error)
    return []
  }
}

const getLastMonthsTransactions = async (): Promise<Transaction[]> => {
  try {
    const allTransactions = await getAllTransactions()

    const startOfLastMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      1
    ).getTime()
    const endOfLastMonth =
      new Date(new Date().getFullYear(), new Date().getMonth(), 0).getTime() +
      (24 * 60 * 60 * 1000 - 1)

    const lastMonthsTransactions = allTransactions.filter((transaction) => {
      const transactionDate = parseDateString(transaction.createdAt)
      return (
        transactionDate >= startOfLastMonth && transactionDate <= endOfLastMonth
      )
    })

    return lastMonthsTransactions
  } catch (error) {
    console.error("Error fetching last month's transactions:", error)
    return []
  }
}

const getLastMonthsEmployerTransactions = async (): Promise<
  EmployerTransaction[]
> => {
  try {
    const allEmployerTransactions = await getAllEmployerTransactions()

    const startOfLastMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      1
    ).getTime()
    const endOfLastMonth =
      new Date(new Date().getFullYear(), new Date().getMonth(), 0).getTime() +
      (24 * 60 * 60 * 1000 - 1)

    const lastMonthsEmployerTransactions = allEmployerTransactions.filter(
      (employerTransaction) => {
        const transactionDate = parseDateString(employerTransaction.createdAt)
        return (
          transactionDate >= startOfLastMonth &&
          transactionDate <= endOfLastMonth
        )
      }
    )

    return lastMonthsEmployerTransactions
  } catch (error) {
    console.error("Error fetching last month's employer transactions:", error)
    return []
  }
}

const getLastMonthsOfficeTransactions = async (): Promise<
  OfficeTransaction[]
> => {
  try {
    const allOfficeTransactions = await getAllOfficeTransactions()

    const startOfLastMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      1
    ).getTime()
    const endOfLastMonth =
      new Date(new Date().getFullYear(), new Date().getMonth(), 0).getTime() +
      (24 * 60 * 60 * 1000 - 1)

    const lastMonthsEmployerTransactions = allOfficeTransactions.filter(
      (officeTransaction) => {
        const transactionDate = parseDateString(officeTransaction.createdAt)
        return (
          transactionDate >= startOfLastMonth &&
          transactionDate <= endOfLastMonth
        )
      }
    )

    return lastMonthsEmployerTransactions
  } catch (error) {
    console.error("Error fetching last month's office transactions:", error)
    return []
  }
}

const getLastMonthsTransactionsByUserId = async (
  userId: string
): Promise<Transaction[]> => {
  try {
    const allTransactions = await getAllTransactions()

    const startOfLastMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      1
    ).getTime()
    const endOfLastMonth =
      new Date(new Date().getFullYear(), new Date().getMonth(), 0).getTime() +
      (24 * 60 * 60 * 1000 - 1)

    const lastMonthsTransactions = allTransactions.filter((transaction) => {
      const transactionDate = parseDateString(transaction.createdAt)
      return (
        transaction.userIds.includes(userId) &&
        transactionDate >= startOfLastMonth &&
        transactionDate <= endOfLastMonth
      )
    })

    return lastMonthsTransactions
  } catch (error) {
    console.error("Error fetching last month's transactions by user ID:", error)
    return []
  }
}

const getLastMonthsEmployerTransactionsByUserId = async (
  userId: string
): Promise<EmployerTransaction[]> => {
  try {
    const allEmployerTransactions = await getAllEmployerTransactions()

    const startOfLastMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      1
    ).getTime()
    const endOfLastMonth =
      new Date(new Date().getFullYear(), new Date().getMonth(), 0).getTime() +
      (24 * 60 * 60 * 1000 - 1)

    const lastMonthsTransactions = allEmployerTransactions.filter(
      (employerTransaction) => {
        const transactionDate = parseDateString(employerTransaction.createdAt)
        return (
          employerTransaction.userId.includes(userId) &&
          transactionDate >= startOfLastMonth &&
          transactionDate <= endOfLastMonth
        )
      }
    )

    return lastMonthsTransactions
  } catch (error) {
    console.error(
      "Error fetching last month's employer transactions by user ID:",
      error
    )
    return []
  }
}

const updateTransaction = async (
  transaction: Transaction
): Promise<Transaction | undefined> => {
  try {
    const transactionId = transaction.id
    if (!transactionId) {
      throw new Error("Transaction id is missing.")
    }

    const transactionDocRef = doc(db, "transactions", transactionId)
    await updateDoc(transactionDocRef, transaction)

    return transaction
  } catch (error) {
    console.error("Error updating transaction:", error)
    throw error
  }
}

const updateEmployerTransaction = async (
  employerTransaction: EmployerTransaction
): Promise<EmployerTransaction | undefined> => {
  try {
    const employerTransactionId = employerTransaction.id
    if (!employerTransactionId) {
      throw new Error("Employer transaction id is missing.")
    }

    const transactionDocRef = doc(
      db,
      "employer-transactions",
      employerTransactionId
    )
    await updateDoc(transactionDocRef, employerTransaction)

    return employerTransaction
  } catch (error) {
    console.error("Error updating employer transaction:", error)
    throw error
  }
}

const updateOfficeTransaction = async (
  officeTransaction: OfficeTransaction
): Promise<OfficeTransaction | undefined> => {
  try {
    const officeTransactionId = officeTransaction.id
    if (!officeTransactionId) {
      throw new Error("Office transaction id is missing.")
    }

    const transactionDocRef = doc(
      db,
      "office-transactions",
      officeTransactionId
    )
    await updateDoc(transactionDocRef, officeTransaction)

    return officeTransaction
  } catch (error) {
    console.error("Error updating office transaction:", error)
    throw error
  }
}

const deleteTransaction = async (transactionId: string): Promise<void> => {
  try {
    const transactionRef = doc(db, "transactions", transactionId)
    await deleteDoc(transactionRef)
  } catch (error) {
    console.error("Error deleting transaction documents:", error)
    throw error
  }
}

const deleteEmployerTransaction = async (
  employerTransactionId: string
): Promise<void> => {
  try {
    const transactionRef = doc(
      db,
      "employer-transactions",
      employerTransactionId
    )
    await deleteDoc(transactionRef)
  } catch (error) {
    console.error("Error deleting employer transaction documents:", error)
    throw error
  }
}

const deleteOfficeTransaction = async (
  officeTransactionId: string
): Promise<void> => {
  try {
    const transactionRef = doc(db, "office-transactions", officeTransactionId)
    await deleteDoc(transactionRef)
  } catch (error) {
    console.error("Error deleting office transaction documents:", error)
    throw error
  }
}

const deleteSelectedTransactions = async (
  transactionIds: Array<ID>
): Promise<void> => {
  try {
    await Promise.all(
      transactionIds.map(async (transactionId) => {
        if (typeof transactionId === "string") {
          await deleteTransaction(transactionId)
        } else {
          console.error("Invalid transactionId")
        }
      })
    )
  } catch (error) {
    console.error("Error deleting transactions:", error)
    throw error
  }
}

const deleteSelectedEmployerTransactions = async (
  employerTransactionIds: Array<ID>
): Promise<void> => {
  try {
    await Promise.all(
      employerTransactionIds.map(async (employerTransactionId) => {
        if (typeof employerTransactionId === "string") {
          await deleteTransaction(employerTransactionId)
        } else {
          console.error("Invalid employerTransactionId")
        }
      })
    )
  } catch (error) {
    console.error("Error deleting employer transactions:", error)
    throw error
  }
}

const deleteSelectedOfficeTransactions = async (
  officeTransactionIds: Array<ID>
): Promise<void> => {
  try {
    await Promise.all(
      officeTransactionIds.map(async (officeTransactionId) => {
        if (typeof officeTransactionId === "string") {
          await deleteTransaction(officeTransactionId)
        } else {
          console.error("Invalid officeTransactionId")
        }
      })
    )
  } catch (error) {
    console.error("Error deleting office transactions:", error)
    throw error
  }
}

export {
  newTransaction,
  newEmployerTransaction,
  newOfficeTransaction,
  getAllTransactions,
  getAllEmployerTransactions,
  getAllOfficeTransactions,
  getTransactionById,
  getEmployerTransactionById,
  getOfficeTransactionById,
  getTransactionsByUserId,
  getEmployerTransactionsByUserId,
  getTransactionsByOfficeId,
  getEmployerTransactionsByOfficeId,
  getOfficeTransactionsByOfficeId,
  getTransactionsByPropertyId,
  getThisMonthsTransactions,
  getThisMonthsEmployerTransactions,
  getThisMonthsOfficeTransactions,
  getThisMonthsTransactionsByUserId,
  getThisMonthsEmployerTransactionsByUserId,
  getLastMonthsTransactions,
  getLastMonthsEmployerTransactions,
  getLastMonthsOfficeTransactions,
  getLastMonthsTransactionsByUserId,
  getLastMonthsEmployerTransactionsByUserId,
  updateTransaction,
  updateEmployerTransaction,
  updateOfficeTransaction,
  deleteTransaction,
  deleteEmployerTransaction,
  deleteOfficeTransaction,
  deleteSelectedTransactions,
  deleteSelectedEmployerTransactions,
  deleteSelectedOfficeTransactions,
}

import { ID } from "../../../../../_metronic/helpers"
import { Transaction } from "./_models"

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
      const transactionDate = Number(transaction.createdAt)
      return transactionDate >= startOfMonth && transactionDate <= endOfMonth
    })

    return thisMonthsTransactions
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
      const transactionDate = Number(transaction.createdAt)
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

const deleteTransaction = async (transactionId: string): Promise<void> => {
  try {
    const transactionRef = doc(db, "transactions", transactionId)
    await deleteDoc(transactionRef)
  } catch (error) {
    console.error("Error deleting transaction documents:", error)
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

export {
  newTransaction,
  getAllTransactions,
  getTransactionById,
  getTransactionsByUserId,
  getTransactionsByOfficeId,
  getTransactionsByPropertyId,
  getThisMonthsTransactions,
  getThisMonthsTransactionsByUserId,
  updateTransaction,
  deleteTransaction,
  deleteSelectedTransactions,
}

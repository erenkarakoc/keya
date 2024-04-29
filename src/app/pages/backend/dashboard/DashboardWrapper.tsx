// import { useEffect, useState } from "react"
import { EnableSidebar, PageTitle } from "../../../../_metronic/layout/core"
import {
  ListsWidget4,
  ListsWidget5,
  TablesWidget9,
  MixedWidget13,
  MixedWidget14,
  MixedWidget15,
} from "../../../../_metronic/partials/widgets"
// import { collection, getDocs, setDoc, doc } from "firebase/firestore"
// import { firestore } from "../../../../firebase/BaseConfig"

const DashboardPage = () => (
  <>
    <div className="row gy-5 g-xl-10">
      {/*begin::Col*/}
      <div className="col-xl-4">
        <MixedWidget13
          className="card-xl-stretch mb-xl-10"
          backGroundColor="#F7D9E3"
          chartHeight="100px"
        />
      </div>
      {/*end::Col*/}

      {/*begin::Col*/}
      <div className="col-xl-4">
        <MixedWidget14
          className="card-xl-stretch mb-xl-10"
          backGroundColor="#CBF0F4"
          chartHeight="100px"
        />
      </div>
      {/*end::Col*/}

      {/*begin::Col*/}
      <div className="col-xl-4">
        <MixedWidget15
          className="card-xl-stretch mb-xl-10"
          backGroundColor="#CBD4F4"
        />
      </div>
      {/*end::Col*/}
    </div>
    {/*end::Row*/}

    <TablesWidget9 className="mb-5 mb-xl-10" />

    {/*begin::Row*/}
    <div className="row gy-5 g-xl-10">
      {/*begin::Col*/}
      <div className="col-xxl-6">
        <ListsWidget5 className="card-xl-stretch mb-xl-10" />
      </div>
      {/*end::Col*/}

      {/*begin::Col*/}
      <div className="col-xxl-6">
        <ListsWidget4 className="card-xl-stretch mb-5 mb-xl-10" items={5} />
      </div>
      {/*end::Col*/}
    </div>
  </>
)

// const MyComponent: React.FC = () => {
//   const [inputValue, setInputValue] = useState<string>("")

//   const handleSubmit = async () => {
//     try {
//       await setDoc(doc(firestore, "users", "user4"), {
//         email: inputValue,
//         password: "hashedpassword4",
//         username: "exampleuser4",
//       })

//       console.log("Document successfully added!")

//       setInputValue("")
//     } catch (error) {
//       console.error("Error adding document: ", error)
//     }
//   }

//   return (
//     <div>
//       {/* Input field */}
//       <input
//         type="text"
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//       />
//       {/* Button to submit */}
//       <button onClick={handleSubmit}>Submit</button>
//     </div>
//   )
// }

const DashboardWrapper = () => {
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const querySnapshot = await getDocs(collection(firestore, "users"))
  //       querySnapshot.forEach((doc) => {
  //         console.log(doc.data())
  //       })
  //     } catch (error) {
  //       console.error("Error getting documents: ", error)
  //     }
  //   }

  //   fetchData()
  // }, [])

  return (
    <EnableSidebar>
      {/* <MyComponent /> */}
      <PageTitle description="You’ve got 24 New Sales" breadcrumbs={[]}>
        Hello Paul
      </PageTitle>
      <DashboardPage />
    </EnableSidebar>
  )
}

export { DashboardWrapper }

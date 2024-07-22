import { useEffect, useState } from 'react';
import logo from './logo.svg';
import secret from './secret.png'
import nsa from './nsa.png'
import pointing from './pointing.png'


function App() {
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [fl, setFl] = useState(true);
  const [users, setUsers] = useState([]);
  const [tags, setTags] = useState([]);
  const [input, setInput] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);

  const getDatas = async () => {
    const searches = [];
    tags.forEach(tag => {
      searches.push(tag.title)
    })
    const response = await fetch("http://localhost:3000/user/" + page, {
      method: 'POST', 
      headers: {
          'Content-Type': 'application/json' 
      },
      body: JSON.stringify({"terms" : searches})
    })
    const us = await response.json();
    const datas = us.data
    if(page === 1 ){
      setUsers(datas)
    } else {
      setUsers(prevData => [...prevData, ...datas])
    }
    setTotalUsers(us.count)
  };

  const handleLoadMore = () => {
    setPage(page + 1)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if(input !== ''){
      setTags(tag => [...tag, {title : input, id : tags.length + 1}])
      setInput('')
    }
  }

  const handleRemoveTag = (id) => {
    setTags(tags.filter(tag => tag.id !== id))
    setInput('')
  }

  const getRandom = () => {
    const randomNumber = Math.floor(Math.random() * 4);
    return randomNumber === 0 ? false : true;
  };

  useEffect(() => {
    getDatas()
  },[page]);

  useEffect(() => {
    setPage(1)
    getDatas()
  },[tags]);

  return (
    <div className="p-8 bg-slate-200">
      <div className='flex flex-row items-center justify-between w-full h-20 mb-4'>
        <img src={nsa} className='h-full' alt="" />
        <span className='bg-gradient-to-t from-rose-600 via-white via-50% to-blue-600 text-xl'>WE'LL FIND YOU</span>
        <img src={pointing} className='h-full' alt="" />
      </div>
      <div className='flex flex-row w-full   '>
        <form onSubmit={(e) => handleSubmit(e)} action='#' className='flex flex-row w-full rounded-lg bg-white h-9 items-center'>
          <div className='flex flex-row'>
            {tags.length > 0 ? 
              tags.map(tag => 
                  <div className='bg-blue-600 m-1 p-0.5 rounded ps-1 pe-1 text-white flex flex-row items-center'>
                    <span className='pe-1'>{tag.title}</span>
                    <i onClick={() => handleRemoveTag(tag.id)} class="fa-solid fa-xmark text-white mt-1 cursor-pointer"></i>
                  </div>
                )
            :''}
          </div>
          <input type="text" className='focus:outline-none border-transparent outline-none w-full h-full p-2 rounded-l-lg' value={input} onChange={(e) => setInput(e.target.value)} placeholder='Ajoutez un tag'/>
          <button className='p-2 h-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center rounded-r-lg'>
           <i class="fa-solid fa-magnifying-glass fa-md text-white"></i>
          </button>
        </form>
        <div className='flex flex-row h-9 items-center ms-2'>
          <div onClick={() => {setStatus(true)}} className={(status === true ? "bg-slate-50" : "bg-slate-200 border-white border-2 hover:bg-slate-50") + " rounded-l-lg h-full w-9 flex items-center justify-center cursor-pointer"}>
            <i class="fa-solid fa-list-ul fa-lg text-blue-500"></i>
          </div>
          <div onClick={() => {setStatus(false)}} className={(status === false ? "bg-slate-50" : "bg-slate-200 border-white border-2 hover:bg-slate-50") + " rounded-r-lg h-full w-9 flex items-center justify-center cursor-pointer"}>
            <i class="fa-solid fa-table fa-lg text-blue-500"></i>
          </div>
        </div>
      </div>
      {status === true ? 
      <div className='w-full flex items-center flex-row flex-wrap mt-4'>
        {users.length > 0 ? 
          users.map((user, index) => 
            <div className='xl:w-1/6 lg:w-1/5 md:w-2/6 sm:w-2/6 w-full cursor-pointer p-1 pe-2 ps-2 mb-6 h-80 hover:scale-105'>
              <div className=' w-full h-60 rounded-t-md relative'>
                <img src={user.imageUrl} className='w-full h-full rounded-t-md' alt="" />
                {(index*181.5) % 6 === 0 ? 
                  <img src={secret} className='absolute top-2 left-2 w-20' alt="" />
                : ""}
              </div> 
              <div className='flex flex-col bg-white rounded-b-md p-2'>
                <span className='font-bold'>{user.firstName} {user.lastName}</span>
                <span className='italic'>{user.jobTitle}</span>
                <span className='w-full truncate'>{user.email}</span>
              </div>
            </div>
          )
        : ''}
        {users.length === totalUsers ? "" : 
        <div className='xl:w-1/6 lg:w-1/5 md:w-2/6 sm:w-2/6 w-full bg-white rounded flex items-center justify-center cursor-pointer p-3 self-auto pb-8 mb-2 h-80 hover:scale-105' onClick={() => handleLoadMore()}>
          <span className='font-bold text-slate-400'>Load more</span>
        </div>
        }
      </div>
      : 
      <div className='w-full mt-4'>
        <div class="relative overflow-x-auto">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead class="text-xs text-gray-700 uppercase bg-gray-100 ">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            Picture
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Name
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Job
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Email
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? 
                      users.map(user => 
                        <tr class="bg-white border-b hover:bg-slate-100">
                          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                              <img className='h-20' src={user.imageUrl} alt="" />
                          </th>
                          <td class="px-6 py-4">
                              {user.firstName} {user.lastName}
                          </td>
                          <td class="px-6 py-4">
                            {user.jobTitle}
                          </td>
                          <td class="px-6 py-4">
                              {user.email}
                          </td>
                      </tr>
                    )
                    : ''}
                </tbody>
            </table>
            {users.length === totalUsers ? "" : 
              <div className='flex flex-row items-center justify-center w-full mt-2' onClick={() => handleLoadMore()}>
                <button className='p-2 rounded bg-blue-600 text-white hover:bg-blue-700'>Load more</button>
              </div>
            }
        </div>
      </div>
      }
      <div className='flex flex-row items-center justify-end w-full mt-4' >
          <span className='self-end'>{users.length} / {totalUsers}</span>
      </div>
      
      
      
    </div>
  );
}

export default App;

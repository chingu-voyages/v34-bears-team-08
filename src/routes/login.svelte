<div class="container flex mx-auto max-w-screen-md items-center h-screen">
    <div class="flex w-2/5">
      <img src="instagram.jpg" alt="iPhone with Instagram app" />
    </div>
    <div class="flex flex-col w-2/5">
      <div class="flex flex-col items-center bg-white p-4 border border-gray-primary mb-4 rounded">
        <h1 class="flex justify-center w-full">
          <img src="instagram.jpg" alt="Instagram" class="mt-2 w-6/12 mb-4" />
        </h1>

       <p class="mb-4 text-xs text-red-primary">error</p>

        <form >
          <input
            aria-label="Enter your email address"
            type="text"
            placeholder="Email address"
            class="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
          />
          <input
            aria-label="Enter your password"
            type="password"
            placeholder="Password"
            class="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
          />
          <button
            type="submit"
            class={`bg-blue-medium text-white w-full rounded h-8 font-bold`}
          >
            Login
          </button>
        </form>
      </div>
      <div class="flex justify-center items-center flex-col w-full bg-white p-4 rounded border border-gray-primary">
        <p class="text-sm">
          Don't have an account?{` `}
          <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  </div>
const useStorage = () => {
    return {
        setItem: (payload) => {
            localStorage.setItem('plivo', JSON.stringify(payload));
        },

        getItem: () => {
            const response = localStorage.getItem('plivo');
            return JSON.parse(response);
        }
    }
}

export default useStorage;

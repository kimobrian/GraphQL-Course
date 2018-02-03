const authors = require('./authors');

// The resolvers
const resolvers = {
  Query: { 
    getAuthors: () => authors ,
    retrieveAuthor: (obj, { id }) => authors.find(author => author.id === id)
  },
  Mutation: {
    createAuthor: (obj, args) => {
      const id = String(authors.length+1);
      const { name, gender} = args;
      const newAuthor = {
        id,
        info: {
          name,
          gender
        }
      }
      authors.push(newAuthor);
      return newAuthor;
    },
    updateAuthor: (obj, { id, name, gender, age}) => {
      const author = authors.find(author => author.id === id);
      if(author) {
        const authorIndex = authors.indexOf(author);
        if(name) author.name = name;
        if(gender) author.gender = gender;
        if(age) author.age = age;
        authors[authorIndex] = { id, info: author };
        return { id, info: author };
      } else {
        throw new Error('Author ID not found');
      }
    }
  }
};

module.exports = resolvers;
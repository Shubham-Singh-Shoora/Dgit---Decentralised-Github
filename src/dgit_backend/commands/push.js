async function push() {
    try {
      console.log('Changes already pushed during commit.');
    } catch (error) {
      console.error('Error pushing changes:', error);
    }
  }
  
  module.exports = push;
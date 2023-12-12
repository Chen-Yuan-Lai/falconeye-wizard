import figlet from 'figlet';

const showTitle = async text => {
  await figlet.text(
    text,
    {
      font: 'Standard', // You can choose different fonts
      horizontalLayout: 'Ghost',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true,
    },
    function (err, data) {
      if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
      }
      console.log(data);
    }
  );
};

export default showTitle;

const express = require('express');
const router = express.Router();

const User = require('../../models/User');
const checkObjectId = require('../../middleware/checkObjectId');



//---------------------------------------
const Spaces = require('../../models/Spaces');




//Creating Space

router.post(
  '/',
  
  async (req, res) => {
   

    const signature = req.header('x-auth-token');
   
    let user_signature = await User.findOne({ signature });
   

     // Check if not signature
     if (!user_signature) {
      return res.status(401).json({ msg: 'Unmatched Signature, authorization denied' });
      }


    try {

      const user = await User.findOne({ signature });
    
      const newSpace = new Spaces({
        tokenId: req.body.tokenId,
        name: req.body.name,
        description: req.body.description,
        contractAddress: req.body.contractAddress,
        signature: req.body.signature,
        category: req.body.category,
        type: req.body.type,
        supply: req.body.supply,
        price: req.body.price,
        image: req.body.image,
        creatorAddress: req.body.creatorAddress,
        user: user.id,
      });

      const space = await newSpace.save();

      res.json(space);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);



//Getting all space
router.get('/', async (req, res) => {

  
  try {
    const spaces = await Spaces.find().sort({ date: -1 }).select(['-signature', '-posts']);
    res.json(spaces);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


//Get by category
router.get('/category/:category', async (req, res) => {

  
  try {
    const spaces = await Spaces.find({category: req.params.category}).sort({ date: -1 }).select(['-signature', '-posts']);
    res.json(spaces);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});





//Get space by Id
router.get('/:id', checkObjectId('id'), async (req, res) => {

  const signature = req.header('x-auth-token');
  const tokenbalance = req.header('x-auth-tokenbalance');
   
    let user_signature = await User.findOne({ signature });
   

     // Check if not signature
     if (!user_signature) {
      return res.status(401).json({ msg: 'Unmatched Signature, authorization denied' });
      }
  
  try {

    
    const space = await Spaces.findById(req.params.id).select(['-signature']);;

    if (!space) {
      return res.status(404).json({ msg: 'Space not found' });
    }


    if(tokenbalance < 1){

      
    var getByPost = space.posts

    const protectedPost = {
      _id: 'protected',
      text: 'protected',
      wallet: 'protected',
      members: 'true',
      signature: 'protected',
      user:'protected',
      date: 'protected'
    }

    getByPost = getByPost.map(u => u.members === protectedPost.members ? protectedPost : u);

    const spaced = {
      _id: space._id,
      tokenId: space.tokenId,
      name: space.name,
      description: space.description,
      contractAddress: space.contractAddress,
      category: space.category,
      type: space.type,
      supply: space.supply,
      price: space.price,
      image: space.image,
      creatorAddress: space.creatorAddress,
      user: space.user,
      posts: getByPost,
      date: space.date,
      moderators: space.moderators,
    }

    
    
    res.json(spaced);

    return;
    }


    res.json(space);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});








//Add post to space

router.post(
  '/post/:id',

  checkObjectId('id'),
  
  async (req, res) => {
    

    const signature = req.header('x-auth-token');
   
    let user_signature = await User.findOne({ signature });
   

     // Check if not signature
     if (!user_signature) {
      return res.status(401).json({ msg: 'Unmatched Signature, authorization denied' });
      }

  

    try {
    
      const space = await Spaces.findById(req.params.id);
      const user = await User.findOne({ signature });

      const newPost = {
        text: req.body.text,
        wallet: req.body.wallet,
        members: req.body.members,
        signature: req.body.signature,
        user: user.id,
      };

      space.posts.unshift(newPost); 

      await space.save();

      res.json(space.posts);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);


router.delete('/post/:id/:post_id', async (req, res) => {

  const signature = req.header('x-auth-token');
   
  let user_signature = await User.findOne({ signature });
 

   // Check if not signature
   if (!user_signature) {
    return res.status(401).json({ msg: 'Unmatched Signature, authorization denied' });
    }


  try {
    const space = await Spaces.findById(req.params.id);
    const user = await User.findOne({ signature });

    // Pull out comment
    const post = space.posts.find(
      (post) => post.id === req.params.post_id
    );


    
    // Make sure comment exists
    if (!post) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }
    // Check user
    if (post.user.toString() !== user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    

    space.posts = space.posts.filter(
      ({ id }) => id !== req.params.post_id
    );

    await space.save();

    return res.json(space.posts);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});


//Add moderators

//Add post to space

router.post(
  '/mod/:id',

  checkObjectId('id'),
  
  async (req, res) => {
    

    const signature = req.header('x-auth-token');
   
    let user_signature = await User.findOne({ signature });
   

     // Check if not signature
     if (!user_signature) {
      return res.status(401).json({ msg: 'Unmatched Signature, authorization denied' });
      }

  

    try {
    
      const space = await Spaces.findById(req.params.id);

      const newMod = {
        wallet: req.body.wallet,
      };

      space.moderators.unshift(newMod); 

      await space.save();

      res.json(space.moderators);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);




router.delete('/mod/:id/:mod_id', async (req, res) => {

  const signature = req.header('x-auth-token');
   
  let user_signature = await User.findOne({ signature });
 

   // Check if not signature
   if (!user_signature) {
    return res.status(401).json({ msg: 'Unmatched Signature, authorization denied' });
    }


  try {
    const space = await Spaces.findById(req.params.id);
  
    // Pull out comment
    const mod = space.moderators.find(
      (mod) => mod.id === req.params.mod_id
    );


    
    // Make sure comment exists
    if (!mod) {
      return res.status(404).json({ msg: 'Moderator does not exist' });
    }
    

    space.moderators = space.moderators.filter(
      ({ id }) => id !== req.params.mod_id
    );

    await space.save();

    return res.json(space.moderators);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});


//Drops



//Add post to space

router.post(
  '/drop/:id',

  checkObjectId('id'),
  
  async (req, res) => {
    

    const signature = req.header('x-auth-token');
   
    let user_signature = await User.findOne({ signature });
   

     // Check if not signature
     if (!user_signature) {
      return res.status(401).json({ msg: 'Unmatched Signature, authorization denied' });
      }

  

    try {
    
      const space = await Spaces.findById(req.params.id);
      const user = await User.findOne({ signature });

      const newDrop = {
        dropId: req.body.dropId,
        creatorAddress: req.body.creatorAddress,
        signature: req.body.signature,
        name: req.body.name,
        description: req.body.description,
        supply: req.body.supply,
        price: req.body.price,
        image: req.body.image,
        user: user.id,
      };

      space.drops.unshift(newDrop); 

      await space.save();

      res.json(space.drops);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);


module.exports = router;

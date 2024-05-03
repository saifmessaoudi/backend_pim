import Rank from "../models/rank.model.js";
import User from "../models/user.model.js";

function addRank(req, res) {
    if (!req.body.name || !req.body.badge || !req.body.requiredPoints) {
        return res.status(400).json({ error: 'Incomplete data for rank creation' });
    }

    const newRank = new Rank({
        name: req.body.name,
        badge: req.body.badge,
        requiredPoints: req.body.requiredPoints
    });

    newRank.save()
        .then(() => res.status(201).json({ message: 'Rank created successfully' }))
        .catch((saveError) => res.status(500).json({ error: saveError.message }));
}

function getRanks(req, res) {
    Rank.find()
        .then((ranks) => res.status(200).json(ranks))
        .catch((findError) => res.status(404).json({ error: findError.message }));
}

function getRankById(req, res) {
    Rank.findById(req.params.id)
        .then((rank) => res.status(200).json(rank))
        .catch((findError) => res.status(404).json({ error: findError.message }));
}

function getRankByName(req, res) {
    Rank.findOne({ name: req.params.name })
        .then((rank) => res.status(200).json(rank))
        .catch((findError) => res.status(404).json({ error: findError.message }));
}

function getRankByPoints(req, res) {
    Rank.find({ requiredPoints: { $lte: req.params.points } })
        .then((rank) => res.status(200).json(rank))
        .catch((findError) => res.status(404).json({ error: findError.message }));
}

function updateRank(req, res) {
    if (!req.body.name || !req.body.badge || !req.body.requiredPoints) {
        return res.status(400).json({ error: 'Incomplete data for rank update' });
    }

    const updatedRank = {
        name: req.body.name,
        badge: req.body.badge,
        requiredPoints: req.body.requiredPoints
    };

    Rank.findByIdAndUpdate(req.params.id, updatedRank)
        .then(() => res.status(200).json({ message: 'Rank updated successfully' }))
        .catch((updateError) => res.status(500).json({ error: updateError.message }));
}

function deleteRank(req, res) {
    Rank.findByIdAndDelete(req.params.id)
        .then(() => res.status(200).json({ message: 'Rank deleted successfully' }))
        .catch((deleteError) => res.status(500).json({ error: deleteError.message }));
}

function affectRankToUser(req, res) {
    if (!req.body.userId || !req.body.rankId) {
        return res.status(400).json({ error: 'Incomplete data for rank assignment' });
    }
     
    Rank.findById(req.body.rankId)
        .then((rank) => {
            if (!rank) {
                return res.status(404).json({ error: 'Rank not found' });
            }

            User.findByIdAndUpdate(req.body.userId, { rank: rank._id })
                .then(() => res.status(200).json({ message: 'Rank assigned successfully' }))
                .catch((updateError) => res.status(500).json({ error: updateError.message }));
        })
        .catch((findError) => res.status(500).json({ error: findError.message }));

}

function getRankByUserId(req, res) {
    User.findById(req.params.id)
        .populate('rank')
        .then((user) => res.status(200).json(user.rank))
        .catch((findError) => res.status(404).json({ error: findError.message }));
}



export default { addRank, getRanks , getRankById , getRankByName , getRankByPoints , updateRank , deleteRank , affectRankToUser , getRankByUserId};
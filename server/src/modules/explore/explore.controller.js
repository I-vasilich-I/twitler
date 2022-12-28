import exploreService from './explore.service.js';

class ExploreController {
  async getbyQueryAndFilter(req, res, next) {
    try {
      const query = req.params.query ?? '';
      const { filter } = req.query;
      const loggedUserId = req.user.id;
      const data = await exploreService.getData(loggedUserId, query, filter);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}

export default new ExploreController();

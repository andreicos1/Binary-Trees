import { Controller, Get, Post, Request } from "@nestjs/common";
import { ViewsService } from "./views.service";

@Controller("views")
export class ViewsController {
  constructor(private readonly viewsService: ViewsService) {}

  @Post()
  async create(@Request() request) {
    const newView = await this.viewsService.create(request.ip);
    if (newView) {
      return "Resource Created";
    }
    return "Already exists";
  }

  @Get()
  async getCount() {
    return this.viewsService.getCount();
  }
}

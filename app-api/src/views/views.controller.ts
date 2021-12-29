import { Controller, Get, Post, Body } from "@nestjs/common";
import { ViewsService } from "./views.service";
import { CreateViewDto } from "./dto/create-view.dto";

@Controller("views")
export class ViewsController {
  constructor(private readonly viewsService: ViewsService) {}

  @Post()
  async create(@Body() createViewDto: CreateViewDto) {
    const newView = await this.viewsService.create(createViewDto.ip);
    if (newView) {
      return "Resource Created";
    }
    return "Already exists or invalid IP";
  }

  @Get()
  getCount() {
    return this.viewsService.getCount();
  }
}

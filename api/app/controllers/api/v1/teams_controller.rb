# frozen_string_literal: true

module Api::V1
  class TeamsController < ApiController
    before_action -> { doorkeeper_authorize! :read }, only: %i[index show]
    before_action -> { doorkeeper_authorize! :write }, only: %i[create update destroy]

    def index
      render json: current_resource_owner.teams.all, include: [:members, :spots]
    end

    def show
      render json: current_resource_owner.teams.find(params[:id]), include: [:members, :spots]， methods: [:leaderboard]
    end

    def create
      @team = current_resource_owner.teams.new(team_params)

      if @team.save
        render json: @team
      else
        render json: @team.errors, status: :unprocessable_entity
      end
    end

    def update
      @team = current_resource_owner.teams.find(params[:id])
      if @team.update(team_params)
        render json: @team
      else
        render json: @team.errors, status: :unprocessable_entity
      end
    end

    def destroy
      @team.destroy
      render :ok
    end

    private

      def team_params
        params.require(:team).permit(:name, :emoji, :logo)
      end
  end
end

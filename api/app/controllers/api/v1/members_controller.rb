# frozen_string_literal: true

module Api::V1
  class MembersController < ApiController
    before_action -> { doorkeeper_authorize! :read }, only: %i[index show]
    before_action -> { doorkeeper_authorize! :write }, only: %i[create update destroy]

    def index
      render json: current_resource_owner.members
    end

    def show
      render json: current_resource_owner.members.find(params[:id])
    end

    def create
      @member = current_resource_owner.members.new(member_params)

      if @member.save
        render json: @member
      else
        render json: @member.errors, status: :unprocessable_entity
      end
    end

    def update
      @member = current_resource_owner.members.find(params[:id])
      if @member.update(member_params)
        render json: @member
      else
        render json: @member.errors, status: :unprocessable_entity
      end
    end

    def destroy
      @member.destroy
      render :ok
    end

    private

      def member_params
        params.require(:member).permit(:team_id)
      end
  end
end

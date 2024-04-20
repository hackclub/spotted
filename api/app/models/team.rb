# frozen_string_literal: true

class Team < ApplicationRecord
  belongs_to :creator, class_name: "User"

  validates :creator, :name, presence: true
  
  has_many :members
  
  has_one_attached :logo
end

